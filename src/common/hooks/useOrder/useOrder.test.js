import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { ORDER_STATUSES } from '@folio/stripes-acq-components';

import { useOrder } from './useOrder';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const order = {
  id: 'po-id',
  workflowStatus: ORDER_STATUSES.pending,
};

describe('useOrder', () => {
  it('should fetch order by id', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve(order),
        }),
      });

    const { result, waitFor } = renderHook(() => useOrder(order.id), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.order).toEqual(order);
  });
});
