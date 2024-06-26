import {
  batchRequest,
  ITEMS_API,
  SEARCH_API,
} from '@folio/stripes-acq-components';

export const fetchLocalPieceItems = (ky, { pieces }) => {
  return batchRequest(
    async ({ params: searchParams }) => {
      const { items = [] } = await ky.get(ITEMS_API, { searchParams }).json();

      return items;
    },
    pieces.filter(({ itemId }) => itemId).map(({ itemId }) => itemId),
  );
};

export const fetchConsortiumPieceItems = (ky, { instanceId, pieces }) => {
  const pieceItemIdsSet = new Set(pieces.map(({ itemId }) => itemId).filter(Boolean));
  const tenantHoldingIdsMap = pieces.reduce((acc, { receivingTenantId, holdingId }) => {
    if (acc.has(receivingTenantId)) {
      acc.get(receivingTenantId).add(holdingId);

      return acc;
    }

    return acc.set(receivingTenantId, new Set().add(holdingId));
  }, new Map());

  return ky
    .get(`${SEARCH_API}/consortium/items`, { searchParams: { instanceId } })
    .json()
    .then(({ items }) => items)
    .then((items) => items.filter(({ id, holdingsRecordId, tenantId }) => {
      return !!tenantHoldingIdsMap.get(tenantId)?.has(holdingsRecordId) && pieceItemIdsSet.has(id);
    }));
};
