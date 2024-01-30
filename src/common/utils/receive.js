import { some } from 'lodash';

import { ITEM_STATUS } from '@folio/stripes-acq-components';

export const unreceivePieces = (pieces, mutatorUnreceive) => {
  if (!pieces || pieces.length === 0) return Promise.resolve();

  const selectedPieces = pieces
    .filter(({ checked }) => checked === true)
    .map(piece => ({
      displaySummary: piece.displaySummary,
      chronology: piece.chronology,
      comment: piece.comment,
      copyNumber: piece.copyNumber,
      displayOnHolding: piece.displayOnHolding,
      enumeration: piece.enumeration,
      pieceId: piece.id,
      itemStatus: ITEM_STATUS.onOrder,
    }));

  const postData = {
    toBeReceived: [{
      poLineId: pieces[0]?.poLineId,
      received: selectedPieces.length,
      receivedItems: selectedPieces,
    }],
    totalRecords: selectedPieces.length,
  };

  return mutatorUnreceive.POST(postData).then(({ receivingResults }) => {
    if (some(receivingResults, ({ processedWithError }) => processedWithError > 0)) {
      return Promise.reject(receivingResults);
    }

    return receivingResults;
  });
};
