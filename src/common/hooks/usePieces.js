import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';
import {
  LIMIT_MAX,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

export const usePieces = (
  kyOptions = {},
  queryOptions = {},
) => {
  const {
    tenantId,
    ...restKyOptions
  } = kyOptions;
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace();

  const queryKey = [namespace, 'pieces'];

  const options = {
    ...restKyOptions,
    searchParams: {
      limit: LIMIT_MAX,
      ...kyOptions?.searchParams,
    },
  };

  const queryFn = () => ky.get(ORDER_PIECES_API, options).json();
  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn,
    ...queryOptions,
  });

  return {
    isFetching,
    isLoading,
    pieces: data?.pieces,
    piecesCount: data?.totalRecords,
  };
};
