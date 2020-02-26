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

export const getItemsMap = (items = []) => items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});

export const getPieceStatusFromItem = (item) => {
  const itemStatus = item?.status?.name || ITEM_STATUS.undefined;

  return itemStatus === ITEM_STATUS.onOrder
    ? ITEM_STATUS.inProcess
    : itemStatus;
};
