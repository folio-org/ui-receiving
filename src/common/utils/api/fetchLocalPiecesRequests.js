import chunk from 'lodash/chunk';

import {
  CHUNK_SIZE,
  MAX_PARALLEL_REQUESTS,
  PIECE_REQUESTS_API,
} from '../../constants';
import { buildPieceRequestsSearchParams } from '../buildPieceRequestsSearchParams';

/*
  Fetch circulation requests from local tenant for given pieces.
  https://s3.amazonaws.com/foliodocs/api/mod-orders/r/pieces-requests.html#orders_pieces_requests_get
*/
export const fetchLocalPiecesRequests = (httpClient) => async (pieces, options = {}) => {
  const results = [];

  if (!pieces?.length) {
    return Promise.resolve(results);
  }

  const pieceChunks = chunk(pieces, CHUNK_SIZE);
  const pieceChunksGroups = chunk(pieceChunks, MAX_PARALLEL_REQUESTS);

  for (const group of pieceChunksGroups) {
    const responses = await Promise.all(
      group.map(async (_chunk) => {
        return httpClient.get(
          PIECE_REQUESTS_API,
          {
            searchParams: buildPieceRequestsSearchParams(_chunk),
            ...options,
          },
        )
          .json()
          .then(({ circulationRequests }) => circulationRequests);
      }),
    );

    results.push(...responses);
  }

  return results.flat();
};
