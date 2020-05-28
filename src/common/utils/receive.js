import { some } from 'lodash';

import { ITEM_STATUS } from '@folio/stripes-acq-components';

import { getDehydratedPiece } from './getDehydratedPiece';

const createItem = (mutatorHoldings, mutatorItems, values, instanceId) => {
  const isCreateItem = Boolean(values.isCreateItem);
  const { locationId: permanentLocationId, poLineId } = values;
  const item = {
    materialType: { id: '615b8413-82d5-4203-aa6e-e37984cb5ac3' },
    permanentLoanType: { id: '2b94c631-fca9-4892-a730-03ee529ffe27' },
    purchaseOrderLineIdentifier: poLineId,
    status: { name: ITEM_STATUS.onOrder },
  };
  const holding = {
    instanceId,
    permanentLocationId,
  };

  return isCreateItem
    ? mutatorHoldings.GET({ params: { query: `instanceId==${instanceId} and permanentLocationId==${permanentLocationId}` } })
      .then((holdings) => holdings[0] || mutatorHoldings.POST(holding))
      .then(({ id: holdingsRecordId }) => mutatorItems.POST({ ...item, holdingsRecordId }))
    : Promise.resolve();
};

export const checkInItems = (pieces, mutator) => {
  const selectedPieces = pieces
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

export const savePiece = (mutatorPiece, mutatorHoldings, mutatorItems, values, instanceId) => {
  const mutatorMethod = values.id ? 'PUT' : 'POST';
  const piece = getDehydratedPiece(values);

  return createItem(mutatorHoldings, mutatorItems, values, instanceId)
    .then((item) => mutatorPiece[mutatorMethod]({ ...piece, itemId: piece.itemId || item?.id }));
};

export const checkIn = (pieces, mutatorPiece, mutatorCheckIn, mutatorHoldings, mutatorItems, instanceId) => {
  const createItemsPromises = pieces.filter(({ isCreateItem }) => isCreateItem)
    .map((piece) => savePiece(mutatorPiece, mutatorHoldings, mutatorItems, piece, instanceId));

  return Promise.all(createItemsPromises).then(() => checkInItems(pieces, mutatorCheckIn)
    .then(({ receivingResults }) => {
      if (some(receivingResults, ({ processedWithError }) => processedWithError > 0)) {
        return Promise.reject(receivingResults);
      }

      return receivingResults;
    }));
};

export const quickReceive = (mutatorCheckIn, mutatorPiece, mutatorHoldings, mutatorItems, values, instanceId) => {
  return savePiece(mutatorPiece, mutatorHoldings, mutatorItems, values, instanceId)
    .then(piece => checkInItems(
      [{
        ...piece,
        itemStatus: ITEM_STATUS.inProcess,
      }],
      mutatorCheckIn,
    ));
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
