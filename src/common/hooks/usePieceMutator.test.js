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
  const kyMock = jest.fn();
  const KY_PATH = 'orders/pieces/pieceId';

  beforeEach(() => {
    kyMock.mockClear().mockReturnValue(Promise.resolve());
  });

  it('should make post request when id is not provided', async () => {
    kyMock.mockClear().mockReturnValue(Promise.resolve({ json: () => ({ id: 'pieceId' }) }));

    useOkapiKy.mockClear().mockReturnValue(kyMock);

    const { result } = renderHook(
      () => usePieceMutator(),
      { wrapper },
    );

    await result.current.mutatePiece({
      piece: {
        holdingId: 'holdingId',
        caption: 'v1',
      },
    });

    expect(kyMock).toHaveBeenCalled();
  });

  it('should make put request when id is provided', async () => {
    useOkapiKy.mockClear().mockReturnValue(kyMock);

    const { result } = renderHook(
      () => usePieceMutator(),
      { wrapper },
    );

    await result.current.mutatePiece({
      piece: {
        id: 'pieceId',
        holdingId: 'holdingId',
        caption: 'v1',
      },
    });

    expect(kyMock).toHaveBeenCalled();
  });

  it('should add createItem query param when piece isCreateItem is true', async () => {
    const pieceValues = {
      id: 'pieceId',
      holdingId: 'holdingId',
      caption: 'v1',
      isCreateItem: true,
    };

    useOkapiKy.mockClear().mockReturnValue(kyMock);

    const { result } = renderHook(
      () => usePieceMutator(),
      { wrapper },
    );

    await result.current.mutatePiece({ piece: pieceValues });

    expect(kyMock).toHaveBeenCalledWith(KY_PATH, {
      method: 'put',
      json: getDehydratedPiece(pieceValues),
      searchParams: { createItem: true },
    });
  });

  it('should not add createItem query param when piece isCreateItem is false', async () => {
    const pieceValues = {
      id: 'pieceId',
      holdingId: 'holdingId',
      caption: 'v1',
    };

    useOkapiKy.mockClear().mockReturnValue(kyMock);

    const { result } = renderHook(
      () => usePieceMutator(),
      { wrapper },
    );

    await result.current.mutatePiece({ piece: pieceValues });

    expect(kyMock).toHaveBeenCalledWith(KY_PATH, {
      json: getDehydratedPiece(pieceValues),
      method: 'put',
      searchParams: {},
    });
  });

  it('should make delete request when \'delete\' method is specified in options', async () => {
    const pieceValues = {
      id: 'pieceId',
      holdingId: 'holdingId',
    };

    useOkapiKy.mockClear().mockReturnValue(kyMock);

    const { result } = renderHook(
      () => usePieceMutator(),
      { wrapper },
    );

    await result.current.mutatePiece({
      piece: pieceValues,
      options: {
        method: 'delete',
        searchParams: { deleteHolding: true },
      },
    });

    expect(kyMock).toHaveBeenCalledWith(KY_PATH, {
      json: getDehydratedPiece(pieceValues),
      method: 'delete',
      searchParams: { deleteHolding: true },
    });
  });
});
