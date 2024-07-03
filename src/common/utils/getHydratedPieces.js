import {
  batchFetch,
  ITEM_STATUS,
} from '@folio/stripes-acq-components';

export const getPieceStatusFromItem = (item) => {
  return item?.status?.name || ITEM_STATUS.undefined;
};

export function getHydratedPieces(pieces, mutatorRequests, mutatorItems) {
  // TODO: fetch consortium context's data
  const itemsIds = pieces.filter(({ itemId }) => itemId).map(({ itemId }) => itemId);
  const requestsPromise = batchFetch(mutatorRequests, pieces, (piecesChunk) => {
    const itemIdsQuery = piecesChunk
      .filter(piece => piece.itemId)
      .map(piece => `itemId==${piece.itemId}`)
      .join(' or ');

    return itemIdsQuery ? `(${itemIdsQuery}) and status="Open*"` : '';
  });

  return Promise.all([
    batchFetch(mutatorItems, itemsIds),
    requestsPromise,
    pieces,
  ])
    .then(([itemsResponse, requestsResponse, piecesResponse]) => {
      const itemsMap = itemsResponse.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
      const requestsMap = requestsResponse.reduce((acc, r) => ({ ...acc, [r.itemId]: r }), {});

      return piecesResponse.map((piece) => ({
        ...piece,
        itemId: itemsMap[piece.itemId] ? piece.itemId : undefined,
        barcode: itemsMap[piece.itemId]?.barcode,
        accessionNumber: itemsMap[piece.itemId]?.accessionNumber,
        callNumber: itemsMap[piece.itemId]?.itemLevelCallNumber,
        itemStatus: getPieceStatusFromItem(itemsMap[piece.itemId]),
        request: requestsMap[piece.itemId],
        holdingsRecordId: itemsMap[piece.itemId]?.holdingsRecordId,
      }));
    });
}
