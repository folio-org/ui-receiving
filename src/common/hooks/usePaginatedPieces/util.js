import {
  batchRequest,
  ITEMS_API,
} from '@folio/stripes-acq-components';

import {
  PIECE_REQUESTS_API,
  TENANT_ITEMS_API,
} from '../../constants';
import { buildPieceRequestsSearchParams } from '../../utils';

export const fetchLocalPieceItems = (ky, { pieces }) => {
  const itemIds = pieces.reduce((acc, { itemId }) => {
    return itemId ? acc.concat(itemId) : acc;
  }, []);

  return batchRequest(
    async ({ params: searchParams }) => {
      const { items = [] } = await ky.get(ITEMS_API, { searchParams }).json();

      return items;
    },
    itemIds,
  );
};

export const fetchConsortiumPieceItems = (ky, { pieces }) => {
  const dto = {
    tenantItemPairs: pieces.filter(({ itemId }) => Boolean(itemId)).map(({ itemId, receivingTenantId }) => ({
      tenantId: receivingTenantId,
      itemId,
    })),
  };

  return ky
    .post(TENANT_ITEMS_API, { json: dto })
    .json()
    .then(({ tenantItems }) => tenantItems.map(({ item, tenantId }) => ({ tenantId, ...item })));
};

export const fetchLocalPieceRequests = (ky, { pieces }) => {
  if (!pieces.length) {
    return Promise.resolve([]);
  }

  return ky
    .get(PIECE_REQUESTS_API, {
      searchParams: buildPieceRequestsSearchParams(pieces),
    })
    .json()
    .then(({ circulationRequests }) => circulationRequests);
};
