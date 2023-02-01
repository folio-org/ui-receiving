import { renderHook } from '@testing-library/react-hooks';

import { ITEM_STATUS } from '@folio/stripes-acq-components';

import {
  getItemById,
  getPieceById,
} from '../utils';
import {
  useQuickReceive,
} from './useQuickReceive';
import {
  usePieceMutator,
} from './usePieceMutator';
import {
  useReceive,
} from './useReceive';

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  getItemById: jest.fn(() => () => Promise.resolve({})),
  getPieceById: jest.fn(() => () => Promise.resolve({ json: () => ({}) })),
}));
jest.mock('./usePieceMutator', () => ({
  usePieceMutator: jest.fn(),
}));
jest.mock('./useReceive', () => ({
  useReceive: jest.fn(),
}));

const pieceValues = {
  id: 'pieceId',
  holdingId: 'holdingId',
  caption: 'v1',
};

describe('useQuickReceive', () => {
  let mutatePieceMock;
  let receivePieceMock;

  beforeEach(() => {
    mutatePieceMock = jest.fn().mockReturnValue(Promise.resolve(pieceValues));
    receivePieceMock = jest.fn();

    getItemById.mockClear();
    getPieceById.mockClear();
    usePieceMutator.mockClear().mockReturnValue({ mutatePiece: mutatePieceMock });
    useReceive.mockClear().mockReturnValue({ receive: receivePieceMock });
  });

  it('should call mutate piece', async () => {
    const { result } = renderHook(() => useQuickReceive());

    await result.current.quickReceive(pieceValues);

    expect(mutatePieceMock).toHaveBeenCalled();
  });

  it('should call receive', async () => {
    const { result } = renderHook(() => useQuickReceive());

    await result.current.quickReceive(pieceValues);

    expect(receivePieceMock).toHaveBeenCalled();
  });

  describe('item status update', () => {
    let quickReceive;
    const itemId = 'itemId';

    beforeEach(() => {
      getPieceById.mockReturnValue(() => Promise.resolve({ json: () => ({ ...pieceValues, itemId }) }));
      mutatePieceMock.mockImplementation(({ piece }) => Promise.resolve(piece));

      const { result } = renderHook(() => useQuickReceive());

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
