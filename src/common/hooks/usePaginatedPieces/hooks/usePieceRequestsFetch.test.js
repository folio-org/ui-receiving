import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { fetchLocalPieceRequests } from '../util';
import { usePieceRequestsFetch } from './usePieceRequestsFetch';

jest.mock('../util', () => ({
  ...jest.requireActual('../util'),
  fetchLocalPieceRequests: jest.fn(),
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

    expect(fetchLocalPieceRequests).toHaveBeenCalled();
  });
});
