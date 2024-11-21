import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useHoldingsAndLocations } from './useHoldingsAndLocations';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const holdingsRecords = [
  {
    'id': 'd7e99892-6d7d-46eb-8a4c-3aa471785819',
    'instanceId': '8804aeeb-db18-4c42-b0e9-28d63c7855e6',
    'permanentLocationId': '9d1b77e8-f02e-4b7f-b296-3f2042ddac54',
  },
  {
    'id': '5636949f-8f97-4b25-a0fc-90fdb050ffb0',
    'instanceId': '8804aeeb-db18-4c42-b0e9-28d63c7855e6',
    'permanentLocationId': '9d1b77e8-f02e-4b7f-b296-3f2042ddac54',
  },
];

const locations = [
  {
    'id': '9d1b77e8-f02e-4b7f-b296-3f2042ddac54',
    'name': 'DCB',
    'code': '000',
  },
];

const getMock = jest.fn()
  .mockReturnValueOnce({ json: () => Promise.resolve({ holdingsRecords }) })
  .mockReturnValue({ json: () => Promise.resolve({ locations }) });

describe('useHoldingsAndLocations', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: getMock,
    });
  });

  it('should fetch pieces requests', async () => {
    const { result } = renderHook(() => useHoldingsAndLocations({ instanceId: '1', tenantId: '2' }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.locations).toEqual(locations);
  });
});
