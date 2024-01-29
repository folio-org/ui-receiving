import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { EXPECT_API } from '../../constants';
import { usePiecesExpect } from './usePiecesExpect';

const pieceValues = {
  id: 'pieceId',
  holdingId: 'holdingId',
  caption: 'v1',
  comment: '123',
};

const kyMock = {
  post: jest.fn(() => ({
    json: () => Promise.resolve({ receivingResults: [{ processedWithError: 0 }] }),
  })),
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('usePiecesExpect', () => {
  beforeEach(() => {
    kyMock.post.mockClear();
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it('should call expect pieces API', async () => {
    const { result } = renderHook(() => usePiecesExpect(), { wrapper });

    await result.current.expectPieces([pieceValues]);

    expect(kyMock.post).toHaveBeenCalledWith(EXPECT_API, expect.anything());
  });

  it('should reject if there are results with errors', async () => {
    const receivingResults = [{ processedWithError: 1 }];

    kyMock.post.mockImplementationOnce(() => ({
      json: () => Promise.resolve({ receivingResults }),
    }));

    const { result } = renderHook(() => usePiecesExpect(), { wrapper });

    try {
      await result.current.expectPieces([pieceValues]);
    } catch (error) {
      expect(error).toEqual(receivingResults);
    }
  });
});
