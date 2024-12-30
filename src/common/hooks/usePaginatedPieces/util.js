import chunk from 'lodash/chunk';

import {
  batchRequest,
  ITEMS_API,
} from '@folio/stripes-acq-components';

import {
  CHUNK_SIZE,
  MAX_PARALLEL_REQUESTS,
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

export const fetchLocalPieceRequests = async (ky, { pieces }) => {
  const results = [];

  if (!pieces?.length) {
    return Promise.resolve(results);
  }

  const pieceChunks = chunk(pieces, CHUNK_SIZE);
  const pieceChunksGroups = chunk(pieceChunks, MAX_PARALLEL_REQUESTS);

  for (const group of pieceChunksGroups) {
    const responses = await Promise.all(
      group.map(async (_chunk) => {
        return ky.get(
          PIECE_REQUESTS_API,
          { searchParams: buildPieceRequestsSearchParams(_chunk) },
        )
          .json()
          .then(({ circulationRequests }) => circulationRequests);
      }),
    );

    results.push(...responses);
  }

  return results.flat();
};
