import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';
import {
  LIMIT_MAX,
  ITEMS_API,
} from '@folio/stripes-acq-components';

export const useHoldingItems = (
  holdingsRecordId,
  kyOptions = {},
  queryOptions = {},
) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const queryKey = [namespace, 'items', holdingsRecordId];

  const options = {
    ...kyOptions,
    searchParams: {
      limit: LIMIT_MAX,
      ...kyOptions?.searchParams,
      query: `holdingsRecordId==${holdingsRecordId}`,
    },
  };

  const queryFn = () => ky.get(ITEMS_API, options).json();
  const { data, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn,
    enabled: Boolean(holdingsRecordId),
    ...queryOptions,
  });

  return {
    isFetching,
    isLoading,
    items: data?.items,
    itemsCount: data?.totalRecords,
  };
};
