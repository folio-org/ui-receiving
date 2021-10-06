import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { usePieces } from './usePieces';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const pieces = [{
  id: 'pieceId',
}];

describe('usePieces', () => {
  const mockGet = jest.fn(() => ({
    json: () => ({
      pieces,
      totalRecords: pieces.length,
    }),
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should fetch pieces', async () => {
    const { result, waitFor } = renderHook(() => usePieces(), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(result.current.pieces).toEqual(pieces);
    expect(mockGet).toHaveBeenCalledWith(
      'orders/pieces',
      {
        searchParams: {
          limit: 1000,
        },
      },
    );
  });
});
