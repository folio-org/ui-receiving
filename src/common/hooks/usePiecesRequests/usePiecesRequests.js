import chunk from 'lodash/chunk';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  CHUNK_SIZE,
  MAX_PARALLEL_REQUESTS,
  PIECE_REQUESTS_API,
} from '../../constants';
import { buildPieceRequestsSearchParams } from '../../utils';

const DEFAULT_DATA = [];

export const usePiecesRequests = (pieces = [], options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'pieces-requests' });
  const ky = useOkapiKy({ tenant: tenantId });

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, tenantId, pieces],
    queryFn: async ({ signal }) => {
      const chunks = chunk(pieces, CHUNK_SIZE);
      const chunkGroups = chunk(chunks, MAX_PARALLEL_REQUESTS);

      const initialAccumulator = { circulationRequests: [], totalRecords: 0 };

      for (const group of chunkGroups) {
        const responses = await Promise.all(
          group.map(async (_chunk) => {
            const searchParams = buildPieceRequestsSearchParams(_chunk);

            return ky.get(PIECE_REQUESTS_API, { searchParams, signal }).json();
          }),
        );

        responses.forEach((response) => {
          initialAccumulator.circulationRequests.push(...response.circulationRequests);
          initialAccumulator.totalRecords += response.totalRecords;
        });
      }

      return initialAccumulator;
    },
    enabled: enabled && Boolean(pieces.length),
    ...queryOptions,
  });

  return ({
    requests: data?.circulationRequests || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  });
};
