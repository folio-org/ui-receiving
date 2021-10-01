import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { usePieceMutation } from './usePieceMutation';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('usePieceMutation', () => {
  const kyMock = jest.fn();

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should make post request when \'id\' is not provided', async () => {
    const { result } = renderHook(
      () => usePieceMutation(),
      { wrapper },
    );

    await result.current.mutatePiece({
      piece: {},
    });

    expect(kyMock).toHaveBeenCalledWith(
      'orders/pieces',
      {
        json: {},
        method: 'post',
      },
    );
  });

  it('should make put request when \'id\' is provided', async () => {
    const { result } = renderHook(
      () => usePieceMutation(),
      { wrapper },
    );

    await result.current.mutatePiece({
      piece: { id: 42 },
    });

    expect(kyMock).toHaveBeenCalledWith(
      'orders/pieces/42',
      {
        json: { id: 42 },
        method: 'put',
      },
    );
  });

  it('should make delete request when \'delete\' method is specified in options', async () => {
    const { result } = renderHook(
      () => usePieceMutation(),
      { wrapper },
    );

    await result.current.mutatePiece({
      piece: { id: 42 },
      options: { method: 'delete' },
    });

    expect(kyMock).toHaveBeenCalledWith(
      'orders/pieces/42',
      {
        json: { id: 42 },
        method: 'delete',
      },
    );
  });
});
