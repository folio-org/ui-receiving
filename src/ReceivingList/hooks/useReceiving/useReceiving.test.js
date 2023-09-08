import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useLocation } from 'react-router';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useReceiving } from './useReceiving';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn(),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: () => ['namespace'],
  useOkapiKy: jest.fn(),
}));

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const titles = [{ poLineId: '3e1a947f-a605-41b8-839c-7929f02ef911' }];

describe('useReceiving', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            titles,
            totalRecords: titles.length,
          }),
        }),
      });
  });

  it('should return an empty list if there no filters were passed in the query', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: '' });

    const { result } = renderHook(() => useReceiving({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
    }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current).toEqual({
      titles: [],
      totalRecords: 0,
      isFetching: false,
    });
  });

  it('should return fetched hydrated receivings list', async () => {
    useLocation
      .mockClear()
      .mockReturnValue({ search: 'purchaseOrder.workflowStatus=Open' });

    const fetchReferences = jest.fn().mockReturnValue(Promise.resolve({
      orderLinesMap: { [titles[0].poLineId]: { id: titles[0].poLineId } },
    }));
    const { result } = renderHook(() => useReceiving({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
      fetchReferences,
    }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current).toEqual(expect.objectContaining({
      titles: [{
        poLine: {
          id: titles[0].poLineId,
        },
        poLineId: titles[0].poLineId,
      }],
      totalRecords: 1,
      isFetching: false,
    }));
  });
});
