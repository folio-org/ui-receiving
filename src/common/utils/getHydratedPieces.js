import {
  batchFetch,
  ITEM_STATUS,
} from '@folio/stripes-acq-components';

const getPieceStatusFromItem = (item) => {
  const itemStatus = item?.status?.name || ITEM_STATUS.undefined;

  return itemStatus === ITEM_STATUS.onOrder || itemStatus === ITEM_STATUS.orderClosed
    ? ITEM_STATUS.inProcess
    : itemStatus;
};

export function getHydratedPieces(pieces, mutatorRequests, mutatorItems) {
  const itemsIds = pieces.filter(({ itemId }) => itemId).map(({ itemId }) => itemId);
  const requestsPromise = batchFetch(mutatorRequests, pieces, (piecesChunk) => {
    const itemIdsQuery = piecesChunk
      .filter(piece => piece.itemId)
      .map(piece => `itemId==${piece.itemId}`)
      .join(' or ');

    return itemIdsQuery ? `(${itemIdsQuery}) and status="Open*"` : '';
  });

  return Promise.all([batchFetch(mutatorItems, itemsIds), requestsPromise, pieces])
    .then(([itemsResponse, requestsResponse, piecesResponse]) => {
      const itemsMap = itemsResponse.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
      const requestsMap = requestsResponse.reduce((acc, r) => ({ ...acc, [r.itemId]: r }), {});

      return piecesResponse.map((piece) => ({
        ...piece,
        barcode: itemsMap[piece.itemId]?.barcode,
        callNumber: itemsMap[piece.itemId]?.itemLevelCallNumber,
        itemStatus: getPieceStatusFromItem(itemsMap[piece.itemId]),
        request: requestsMap[piece.itemId],
      }));
    });
}
