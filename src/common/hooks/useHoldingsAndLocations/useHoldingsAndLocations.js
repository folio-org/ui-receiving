import { useQuery } from 'react-query';

import {
  batchRequest,
  HOLDINGS_API,
  LIMIT_MAX,
  LOCATIONS_API,
} from '@folio/stripes-acq-components';
import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const DEFAULT_DATA = [];

export const useHoldingsAndLocations = ({ instanceId, tenantId, options = {} }) => {
  const {
    enabled = true,
    ...queryOptions
  } = options;

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
    queryKey: [namespace, tenantId, instanceId],
    queryFn: async ({ signal }) => {
      const holdings = await ky
        .get(HOLDINGS_API, { searchParams, signal })
        .json()
        .then(response => response.holdingsRecords);

      const locationIds = holdings?.map(({ permanentLocationId }) => permanentLocationId) || DEFAULT_DATA;

      const locations = await batchRequest(
        ({ params }) => ky.get(LOCATIONS_API, { searchParams: params, signal }).json(),
        locationIds,
      ).then(responses => responses.flatMap(response => response.locations));

      return {
        holdings,
        locations,
      };
    },
    enabled: enabled && Boolean(instanceId),
    ...queryOptions,
  });

  return ({
    holdings: data?.holdings || DEFAULT_DATA,
    locations: data?.locations || DEFAULT_DATA,
    isFetching,
    isLoading,
  });
};
