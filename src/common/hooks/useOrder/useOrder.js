import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { ORDERS_API } from '@folio/stripes-acq-components';

export const useOrder = (orderId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'purchase-order' });
  const ky = useOkapiKy({ tenant: tenantId });

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, orderId, tenantId],
    queryFn: ({ signal }) => ky.get(`${ORDERS_API}/${orderId}`, { signal }).json(),
    enabled: enabled && Boolean(orderId),
    ...queryOptions,
  });

  return ({
    order: data,
    isFetching,
    isLoading,
  });
};
