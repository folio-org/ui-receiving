import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { ITEMS_API } from '@folio/stripes-acq-components';

export const useItem = (itemId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'inventory-item' });
  const ky = useOkapiKy({ tenant: tenantId });

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, itemId, tenantId],
    queryFn: ({ signal }) => ky.get(`${ITEMS_API}/${itemId}`, { signal }).json(),
    enabled: enabled && Boolean(itemId),
    ...queryOptions,
  });

  return ({
    item: data,
    isFetching,
    isLoading,
  });
};
