import { useQuery } from 'react-query';

import { LIMIT_MAX } from '@folio/stripes-acq-components';
import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  getHoldingLocations,
  getHoldingLocationsByTenants,
} from '../../utils/getHoldingLocations';

const DEFAULT_DATA = [];

export const useHoldingsAndLocations = ({
  instanceId,
  options = {},
  tenantId,
  /*
   `receivingTenantIds` is a unique list of tenantIds from the pieces list.
    The purpose is that we need to be able to fetch locations from other
    tenants so that we can display all the locations on the full-screen page
  */
  receivingTenantIds = DEFAULT_DATA,
}) => {
  const { enabled = true, ...queryOptions } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'holdings-and-location' });
  const searchParams = {
    query: `instanceId==${instanceId}`,
    limit: LIMIT_MAX,
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, tenantId, instanceId, ...receivingTenantIds],
    queryFn: ({ signal }) => {
      return receivingTenantIds.length
        ? getHoldingLocationsByTenants({ ky, instanceId, receivingTenantIds })
        : getHoldingLocations({ ky, searchParams, signal });
    },
    enabled: enabled && Boolean(instanceId),
    ...queryOptions,
  });

  return ({
    holdings: data?.holdings || DEFAULT_DATA,
    locations: data?.locations || DEFAULT_DATA,
    locationIds: data?.locationIds || DEFAULT_DATA,
    isFetching,
    isLoading,
  });
};
