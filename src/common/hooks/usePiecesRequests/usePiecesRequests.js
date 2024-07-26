import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { PIECE_REQUESTS_API } from '../../constants';

const DEFAULT_DATA = [];

export const usePiecesRequests = (pieceIds = [], options = {}) => {
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
    queryKey: [namespace, tenantId, pieceIds],
    queryFn: ({ signal }) => {
      const searchParams = new URLSearchParams({
        limit: LIMIT_MAX,
        status: 'Open*',
      });

      pieceIds
        .filter(Boolean)
        .forEach((pieceId) => searchParams.append('pieceIds', pieceId));

      return ky.get(PIECE_REQUESTS_API, { searchParams, signal }).json();
    },
    enabled: enabled && Boolean(pieceIds.length),
    ...queryOptions,
  });

  return ({
    requests: data?.circulationRequests || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  });
};
