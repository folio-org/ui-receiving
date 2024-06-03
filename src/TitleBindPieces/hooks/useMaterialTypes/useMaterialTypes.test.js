import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useMaterialTypes } from './useMaterialTypes';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mType = { id: '001', name: 'MTYPE' };

describe('useMaterialTypes', () => {
  it('should return material types', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          mtypes: [mType],
        }),
      }),
    });

    const { result } = renderHook(() => useMaterialTypes(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.materialTypes.length).toEqual(1);
  });
});
