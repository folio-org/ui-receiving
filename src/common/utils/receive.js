import { some } from 'lodash';

import { ITEM_STATUS, PIECE_FORMAT } from '@folio/stripes-acq-components';

import { getDehydratedPiece } from './getDehydratedPiece';

const createItem = (mutatorHoldings, mutatorItems, values, instanceId, loanTypeId, materialTypeId) => {
  const isCreateItem = Boolean(values.isCreateItem);
  const { locationId: permanentLocationId, poLineId } = values;
  const item = {
    materialType: { id: materialTypeId },
    permanentLoanType: { id: loanTypeId },
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
      enumeration: piece.enumeration,
      supplement: piece.supplement,
      locationId: piece.locationId || null,
      holdingId: piece.holdingId || null,
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
    const errorPieces = receivingResults.filter(({ processedWithError }) => processedWithError > 0).reduce(
      (acc, { receivingItemResults }) => {
        const errorResults = receivingItemResults
          .filter(({ processingStatus }) => processingStatus.type === 'failure')
          .map((d) => ({
            ...d,
            enumeration: pieces.find(({ id }) => id === d.pieceId)?.enumeration,
          }));

        return [...acc, ...errorResults];
      },
      [],
    );

    if (errorPieces?.length > 0) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ errorPieces });
    }

    return receivingResults;
  });
};

export const savePiece = (mutatorPiece, mutatorHoldings, mutatorItems, values, instanceId, loanTypeId, poLine) => {
  const mutatorMethod = values.id ? 'PUT' : 'POST';
  const piece = getDehydratedPiece(values);
  const materialTypeId = piece.format === PIECE_FORMAT.electronic
    ? poLine?.eresource?.materialType
    : poLine?.physical?.materialType;

  return createItem(mutatorHoldings, mutatorItems, values, instanceId, loanTypeId, materialTypeId)
    .then((item) => mutatorPiece[mutatorMethod]({ ...piece, itemId: piece.itemId || item?.id }));
};

export const checkIn = (
  pieces,
  mutatorPiece,
  mutatorCheckIn,
  mutatorHoldings,
  mutatorItems,
  instanceId,
  loanTypeId,
  poLine,
) => {
  const createItemsPromises = pieces.filter(({ isCreateItem }) => isCreateItem)
    .map((piece) => savePiece(mutatorPiece, mutatorHoldings, mutatorItems, piece, instanceId, loanTypeId, poLine));

  return Promise.all(createItemsPromises).then(() => checkInItems(pieces.map((piece) => ({
    ...piece,
    itemStatus: piece.itemStatus === ITEM_STATUS.undefined
      ? ITEM_STATUS.inProcess
      : piece.itemStatus,
  })), mutatorCheckIn)
    .then(({ receivingResults }) => {
      if (some(receivingResults, ({ processedWithError }) => processedWithError > 0)) {
        return Promise.reject(receivingResults);
      }

      return receivingResults;
    }));
};

export const quickReceive = (
  mutatorCheckIn,
  mutatorPiece,
  mutatorHoldings,
  mutatorItems,
  values,
  instanceId,
  loanTypeId,
  poLine,
) => {
  return savePiece(mutatorPiece, mutatorHoldings, mutatorItems, values, instanceId, loanTypeId, poLine)
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
