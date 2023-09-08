import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';

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
    const { result } = renderHook(() => usePieces(), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

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
