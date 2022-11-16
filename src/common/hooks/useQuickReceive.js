import { useOkapiKy } from '@folio/stripes/core';

import {
  getItemById,
  getPieceStatusFromItem,
  getReceivingPieceItemStatus,
} from '../utils';
import { usePieceMutator } from './usePieceMutator';
import { useReceive } from './useReceive';

export const useQuickReceive = () => {
  const ky = useOkapiKy();
  const { mutatePiece } = usePieceMutator();
  const { receive } = useReceive();

  const quickReceive = (pieceValues) => {
    return mutatePiece({ piece: pieceValues })
      .then(async ({ itemId, ...piece }) => {
        const item = itemId ? await getItemById(ky)(itemId) : {};

        const itemData = itemId
          ? {
            itemId,
            itemStatus: getReceivingPieceItemStatus({ itemStatus: getPieceStatusFromItem(item) }),
          }
          : {};

        return receive([{ ...piece, ...itemData }]);
      });
  };

  return { quickReceive };
};
