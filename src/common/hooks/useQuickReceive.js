import { ITEM_STATUS } from '@folio/stripes-acq-components';

import { usePieceMutator } from './usePieceMutator';
import { useReceive } from './useReceive';

export const useQuickReceive = () => {
  const { mutatePiece } = usePieceMutator();
  const { receive } = useReceive();

  const quickReceive = (pieceValues) => {
    return mutatePiece({ piece: pieceValues })
      .then(piece => receive([{ ...piece, itemStatus: ITEM_STATUS.inProcess }]));
  };

  return { quickReceive };
};
