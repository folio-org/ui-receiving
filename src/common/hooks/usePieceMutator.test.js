import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { getDehydratedPiece } from '../utils';
import {
  usePieceMutator,
} from './usePieceMutator';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('usePieceMutator', () => {
  it('should make post request when id is not provided', async () => {
    const postMock = jest.fn().mockReturnValue(Promise.resolve({ json: () => ({ id: 'pieceId' }) }));

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result } = renderHook(
      () => usePieceMutator(),
      { wrapper },
    );

    await result.current.mutatePiece({
      holdingId: 'holdingId',
      caption: 'v1',
    });

    expect(postMock).toHaveBeenCalled();
  });

  it('should make put request when id is provided', async () => {
    const putMock = jest.fn().mockReturnValue(Promise.resolve());

    useOkapiKy.mockClear().mockReturnValue({
      put: putMock,
    });

    const { result } = renderHook(
      () => usePieceMutator(),
      { wrapper },
    );

    await result.current.mutatePiece({
      id: 'pieceId',
      holdingId: 'holdingId',
      caption: 'v1',
    });

    expect(putMock).toHaveBeenCalled();
  });

  it('should add createItem query param when piece isCreateItem is true', async () => {
    const putMock = jest.fn().mockReturnValue(Promise.resolve());
    const pieceValues = {
      id: 'pieceId',
      holdingId: 'holdingId',
      caption: 'v1',
      isCreateItem: true,
    };

    useOkapiKy.mockClear().mockReturnValue({
      put: putMock,
    });

    const { result } = renderHook(
      () => usePieceMutator(),
      { wrapper },
    );

    await result.current.mutatePiece(pieceValues);

    expect(putMock.mock.calls[0][1]).toEqual({
      json: getDehydratedPiece(pieceValues),
      searchParams: { createItem: true },
    });
  });

  it('should not add createItem query param when piece isCreateItem is false', async () => {
    const putMock = jest.fn().mockReturnValue(Promise.resolve());
    const pieceValues = {
      id: 'pieceId',
      holdingId: 'holdingId',
      caption: 'v1',
    };

    useOkapiKy.mockClear().mockReturnValue({
      put: putMock,
    });

    const { result } = renderHook(
      () => usePieceMutator(),
      { wrapper },
    );

    await result.current.mutatePiece(pieceValues);

    expect(putMock.mock.calls[0][1]).toEqual({
      json: getDehydratedPiece(pieceValues),
    });
  });
});
