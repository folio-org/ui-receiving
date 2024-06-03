import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useLoanTypes } from './useLoanTypes';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const loanType = { id: '001', name: 'loanType' };

describe('useLoanTypes', () => {
  it('should return loanTypes types', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          loanTypes: [loanType],
        }),
      }),
    });

    const { result } = renderHook(() => useLoanTypes(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.loanTypes.length).toEqual(1);
  });
});
