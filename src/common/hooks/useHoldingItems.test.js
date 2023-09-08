import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useHoldingItems } from './useHoldingItems';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const items = [{
  holdingsRecordId: 'holdingsRecordId',
}];

describe('useHoldingItems', () => {
  const mockGet = jest.fn(() => ({
    json: () => ({
      items,
      totalRecords: items.length,
    }),
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('fetches holding items', async () => {
    const id = items[0].holdingsRecordId;

    const { result } = renderHook(() => useHoldingItems(id), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.items).toEqual(items);
    expect(mockGet).toHaveBeenCalledWith(
      'inventory/items',
      {
        searchParams: {
          limit: 1000,
          query: `holdingsRecordId==${id}`,
        },
      },
    );
  });
});
