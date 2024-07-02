import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import {
  fetchConsortiumPieceItems,
  fetchLocalPieceItems,
} from '../util';
import { usePieceItemsFetch } from './usePieceItemsFetch';

jest.mock('../util', () => ({
  ...jest.requireActual('../util'),
  fetchConsortiumPieceItems: jest.fn(),
  fetchLocalPieceItems: jest.fn(),
}));

const pieces = [{ id: 'piece-id-1' }];

const kyMock = {
  extend: () => kyMock,
  get: jest.fn(() => ({
    json: () => Promise.resolve(),
  })),
};

describe('usePieceItemsFetch', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it('should provide a function that fetches pieces related items', async () => {
    const { result } = renderHook(() => usePieceItemsFetch({ instanceId: 'instanceId' }));

    await result.current.fetchPieceItems({
      pieces,
      crossTenant: false,
    });

    expect(fetchLocalPieceItems).toHaveBeenCalled();
  });

  describe('ECS mode', () => {
    it('should provide a function that fetches pieces related items in all associated tenants ', async () => {
      const { result } = renderHook(() => usePieceItemsFetch({ instanceId: 'instanceId' }));

      await result.current.fetchPieceItems({
        pieces,
        crossTenant: true,
      });

      expect(fetchConsortiumPieceItems).toHaveBeenCalled();
    });
  });
});
