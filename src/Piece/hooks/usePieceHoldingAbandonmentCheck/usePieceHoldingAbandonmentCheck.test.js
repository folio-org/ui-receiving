import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import {
  holdings,
  items,
  pieces,
} from 'fixtures';
import { getHoldingsItemsAndPieces } from '../../../common/utils';
import { useReceivingSearchContext } from '../../../contexts';
import { usePieceHoldingAbandonmentCheck } from './usePieceHoldingAbandonmentCheck';

jest.mock('../../../common/utils', () => ({
  ...jest.requireActual('../../../common/utils'),
  extendKyWithTenant: jest.fn((ky) => ky),
  getHoldingsItemsAndPieces: jest.fn(),
}));

const pieceInitialValues = {
  itemId: 'itemId',
  receivingTenantId: 'receivingTenantId',
};

const kyMock = {
  get: () => ({
    json: () => Promise.resolve(holdings[0]),
  }),
};

describe('usePieceHoldingAbandonmentCheck', () => {
  beforeEach(() => {
    getHoldingsItemsAndPieces
      .mockClear()
      .mockReturnValue(() => ({
        items: { items, totalRecords: items.length },
        pieces: { pieces, totalRecords: pieces.length },
      }));
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
    useReceivingSearchContext
      .mockClear()
      .mockReturnValue({
        targetTenantId: 'tenantId',
        crossTenant: false,
      });
  });

  it('should return an object indicating the absence of abandonment of the holding', async () => {
    const { result } = renderHook(() => usePieceHoldingAbandonmentCheck(pieceInitialValues));

    const { willAbandoned } = await result.current.checkHoldingAbandonment(holdings[0].id);

    expect(willAbandoned).toBeFalsy();
  });

  describe('should return an object indicating the abandonment of the holding', () => {
    it('when there is only one piece associated with the holding', async () => {
      getHoldingsItemsAndPieces
        .mockClear()
        .mockReturnValue(() => ({
          items: { items: [], totalRecords: 0 },
          pieces: { pieces: pieces[0], totalRecords: 1 },
        }));

      const { result } = renderHook(() => usePieceHoldingAbandonmentCheck(pieceInitialValues));

      const { willAbandoned } = await result.current.checkHoldingAbandonment(holdings[0].id);

      expect(willAbandoned).toBeTruthy();
    });

    it('when there is only one item associated with the piece and the holding', async () => {
      getHoldingsItemsAndPieces
        .mockClear()
        .mockReturnValue(() => ({
          items: { items: items[0], totalRecords: 1 },
          pieces: { pieces: pieces[0], totalRecords: 1 },
        }));

      const { result } = renderHook(() => usePieceHoldingAbandonmentCheck(pieceInitialValues));

      const { willAbandoned } = await result.current.checkHoldingAbandonment(holdings[0].id);

      expect(willAbandoned).toBeTruthy();
    });

    describe('ECS mode', () => {
      it('when there is only one item only in the member tenant associated with the piece and the holding', async () => {
        useReceivingSearchContext.mockReturnValue({
          targetTenantId: 'tenantId',
          crossTenant: true,
        });

        getHoldingsItemsAndPieces
          .mockClear()
          .mockReturnValueOnce(() => Promise.resolve({
            items: { items: [], totalRecords: 0 },
            pieces: { pieces: [pieces[0]], totalRecords: 1 },
          }))
          .mockReturnValue(() => Promise.resolve({
            items: { items: [items[0]], totalRecords: 1 },
            pieces: { pieces: [], totalRecords: 0 },
          }));

        const { result } = renderHook(() => usePieceHoldingAbandonmentCheck(pieceInitialValues));

        const { willAbandoned } = await result.current.checkHoldingAbandonment(holdings[0].id);

        expect(willAbandoned).toBeTruthy();
      });
    });
  });
});
