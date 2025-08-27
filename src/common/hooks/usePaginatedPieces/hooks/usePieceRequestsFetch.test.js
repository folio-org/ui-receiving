import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { fetchLocalPiecesRequests } from '../../../utils';
import { usePieceRequestsFetch } from './usePieceRequestsFetch';

jest.mock('../../../utils/api', () => ({
  ...jest.requireActual('../../../utils/api'),
  fetchLocalPiecesRequests: jest.fn(() => () => Promise.resolve()),
}));

const pieces = [{ id: 'piece-id-1' }];

const kyMock = {
  extend: () => kyMock,
  get: jest.fn(() => ({
    json: () => Promise.resolve(),
  })),
};

describe('usePieceRequestsFetch', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it('should provide a function that fetches pieces related requests', async () => {
    const { result } = renderHook(() => usePieceRequestsFetch());

    await result.current.fetchPieceRequests({ pieces });

    expect(fetchLocalPiecesRequests).toHaveBeenCalled();
  });
});
