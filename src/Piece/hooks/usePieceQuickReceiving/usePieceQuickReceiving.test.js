import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { ITEM_STATUS } from '@folio/stripes-acq-components';

import {
  usePieceMutator,
  useReceive,
} from '../../../common/hooks';
import {
  getItemById,
  getPieceById,
} from '../../../common/utils';
import { usePieceQuickReceiving } from './usePieceQuickReceiving';

jest.mock('../../../common/utils', () => ({
  ...jest.requireActual('../../../common/utils'),
  extendKyWithTenant: jest.fn(),
  getItemById: jest.fn(() => () => Promise.resolve({})),
  getPieceById: jest.fn(() => () => Promise.resolve({ json: () => ({}) })),
}));
jest.mock('../../../common/hooks', () => ({
  ...jest.requireActual('../../../common/hooks'),
  usePieceMutator: jest.fn(),
  useReceive: jest.fn(),
}));

const pieceValues = {
  id: 'pieceId',
  holdingId: 'holdingId',
  displaySummary: 'v1',
};

describe('usePieceQuickReceiving', () => {
  let mutatePieceMock;
  let receivePieceMock;

  beforeEach(() => {
    mutatePieceMock = jest.fn().mockReturnValue(Promise.resolve(pieceValues));
    receivePieceMock = jest.fn();

    getItemById.mockClear();
    getPieceById.mockClear();
    usePieceMutator
      .mockClear()
      .mockReturnValue({ mutatePiece: mutatePieceMock });
    useReceive
      .mockClear()
      .mockReturnValue({ receive: receivePieceMock });
  });

  it('should call receive', async () => {
    const { result } = renderHook(() => usePieceQuickReceiving());

    await result.current.quickReceive(pieceValues);

    expect(receivePieceMock).toHaveBeenCalled();
  });

  describe('item status update', () => {
    let quickReceive;
    const itemId = 'itemId';

    beforeEach(() => {
      getPieceById.mockReturnValue(() => Promise.resolve({ json: () => ({ ...pieceValues, itemId }) }));
      mutatePieceMock.mockImplementation(({ piece }) => Promise.resolve(piece));

      const { result } = renderHook(() => usePieceQuickReceiving());

      quickReceive = result.current.quickReceive;
    });

    it('should update item status from \'On order\' to \'In process\'', async () => {
      getItemById.mockReturnValue(() => Promise.resolve({
        id: itemId,
        status: { name: ITEM_STATUS.onOrder },
      }));

      await quickReceive({ ...pieceValues, itemId });

      expect(receivePieceMock).toHaveBeenCalledWith([expect.objectContaining({
        itemStatus: ITEM_STATUS.inProcess,
      })]);
    });

    it('should update item status from \'Order closed\' to \'In process\'', async () => {
      getItemById.mockReturnValue(() => Promise.resolve({
        id: itemId,
        status: { name: ITEM_STATUS.orderClosed },
      }));

      await quickReceive({ ...pieceValues, itemId });

      expect(receivePieceMock).toHaveBeenCalledWith([expect.objectContaining({
        itemStatus: ITEM_STATUS.inProcess,
      })]);
    });

    it('should NOT update item status if it is different from \'On order\' or \'Order closed\'', async () => {
      getItemById.mockReturnValue(() => Promise.resolve({
        id: itemId,
        status: { name: ITEM_STATUS.inTransit },
      }));

      await quickReceive({ ...pieceValues, itemId });

      expect(receivePieceMock).toHaveBeenCalledWith([expect.objectContaining({
        itemStatus: ITEM_STATUS.inTransit,
      })]);
    });
  });
});
