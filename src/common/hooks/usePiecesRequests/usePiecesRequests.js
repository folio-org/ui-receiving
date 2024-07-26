import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { PIECE_REQUESTS_API } from '../../constants';
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
    queryFn: ({ signal }) => {
      const searchParams = buildPieceRequestsSearchParams(pieces);

      return ky.get(PIECE_REQUESTS_API, { searchParams, signal }).json();
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
