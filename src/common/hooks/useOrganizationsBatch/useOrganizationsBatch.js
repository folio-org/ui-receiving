import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  batchRequest,
  VENDORS_API,
} from '@folio/stripes-acq-components';

const DEFAULT_DATA = [];

export const useOrganizationsBatch = (organizationIds, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'organizations-by-ids' });

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, organizationIds, tenantId],
    queryFn: async ({ signal }) => {
      const response = await batchRequest(
        ({ params: searchParams }) => ky.get(VENDORS_API, { searchParams, signal }).json(),
        organizationIds,
      );

      return response.flatMap(({ organizations }) => organizations);
    },
    enabled: enabled && Boolean(organizationIds?.length),
    ...queryOptions,
  });

  return {
    organizations: data || DEFAULT_DATA,
    isFetching,
    isLoading,
  };
};
