import { some } from 'lodash';

import { ITEM_STATUS } from '@folio/stripes-acq-components';

export const checkInItems = (pieces, mutator) => {
  const selectedPieces = pieces
    .filter(({ checked }) => checked === true)
    .map(piece => ({
      id: piece.id,
      barcode: piece.barcode,
      callNumber: piece.callNumber,
      comment: piece.comment,
      caption: piece.caption,
      supplement: piece.supplement,
      locationId: piece.locationId || null,
      itemStatus: piece.itemStatus,
    }));

  const postData = {
    toBeCheckedIn: [{
      poLineId: pieces[0]?.poLineId,
      checkedIn: selectedPieces.length,
      checkInPieces: selectedPieces,
    }],
    totalRecords: selectedPieces.length,
  };

  return mutator.POST(postData).then(({ receivingResults }) => {
    if (some(receivingResults, ({ processedWithError }) => processedWithError > 0)) {
      return Promise.reject(receivingResults);
    }

    return receivingResults;
  });
};

export const unreceivePieces = (pieces, mutatorUnreceive) => {
  if (!pieces || pieces.length === 0) return Promise.resolve();

  const selectedPieces = pieces
    .filter(({ checked }) => checked === true)
    .map(piece => ({
      comment: piece.comment,
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
