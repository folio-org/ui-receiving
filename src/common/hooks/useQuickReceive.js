import { useCallback } from 'react';

import { useOkapiKy } from '@folio/stripes/core';

import {
  getItemById,
  getPieceById,
  getPieceStatusFromItem,
  getReceivingPieceItemStatus,
} from '../utils';
import { usePieceMutator } from './usePieceMutator';
import { useReceive } from './useReceive';

export const useQuickReceive = () => {
  const ky = useOkapiKy();
  const { mutatePiece } = usePieceMutator();
  const { receive } = useReceive();

  const quickReceive = useCallback((pieceValues) => {
    return mutatePiece({ piece: pieceValues })
      .then(async ({ id }) => {
        const piece = await getPieceById({ GET: ({ path }) => ky.get(path) })(id).then(res => res.json());

        const itemId = piece?.itemId;
        const item = itemId ? await getItemById(ky)(itemId) : {};

        const itemData = itemId
          ? {
            itemId,
            itemStatus: getReceivingPieceItemStatus({ itemStatus: getPieceStatusFromItem(item) }),
          }
          : {};

        return receive([{ ...piece, ...itemData }]);
      });
  }, [ky, mutatePiece, receive]);

  return { quickReceive };
};
