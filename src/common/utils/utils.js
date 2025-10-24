import chunk from 'lodash/chunk';
import identity from 'lodash/identity';

import {
  CONSORTIUM_LOCATIONS_API,
  OKAPI_TENANT_HEADER,
  ORDER_PIECES_API,
  SEARCH_API,
} from '@folio/stripes-acq-components';

const CONCURRENT_REQUESTS = 5;

export const getPieceById = (pieceMutator) => (id) => (
  pieceMutator.GET({
    path: `${ORDER_PIECES_API}/${id}`,
  })
    .catch(() => ({}))
);

export const extendKyWithTenant = (ky, tenantId) => {
  return ky.extend({
    hooks: {
      beforeRequest: [
        request => {
          request.headers.set(OKAPI_TENANT_HEADER, tenantId);
        },
      ],
    },
  });
};

export const chunkRequests = (items, queryFn, chunkResolver = identity) => {
  return chunk(items, CONCURRENT_REQUESTS)
    .reduce(async (acc, itemsChunk) => {
      const accResolved = await acc;

      const chunkResponsesMap = await (
        Promise
          .all(itemsChunk.map(queryFn))
          .then(chunkResolver)
      );

      return Promise.resolve([...accResolved, ...chunkResponsesMap]);
    }, Promise.resolve([]));
};

export const fetchConsortiumInstanceHoldings = (ky, options = {}) => {
  return ky.get(`${SEARCH_API}/consortium/holdings`, options).json();
};

export const fetchConsortiumInstanceLocations = (ky, options = {}) => {
  return ky.get(CONSORTIUM_LOCATIONS_API, options).json();
};
