import { some } from 'lodash';

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
