import uniq from 'lodash/uniq';
import { useMemo } from 'react';

import { useCurrentUserTenants } from '@folio/stripes-acq-components';

export const useReceivingTenantIdsAndLocations = ({
  currentReceivingTenantId,
  currentLocationId: locationId,
  receivingTenantIds = [],
}) => {
  const currentUserTenants = useCurrentUserTenants();

  const receivingTenants = useMemo(() => {
    if (receivingTenantIds.length) {
      const currentUserTenantIds = currentUserTenants?.map(({ id: tenantId }) => tenantId);

      // should get unique tenantIds from poLine locations and filter out tenantIds where the current user has assigned
      return uniq([
        ...receivingTenantIds,
        currentReceivingTenantId,
      ].filter((tenantId) => currentUserTenantIds.includes(tenantId))
        .filter(Boolean));
    }

    return [];
  }, [receivingTenantIds, currentUserTenants, currentReceivingTenantId]);

  const additionalLocations = useMemo(() => {
    const locationIds = locationId ? [locationId] : [];
    const tenantLocationIdsMap = currentReceivingTenantId ? { [currentReceivingTenantId]: locationIds } : {};

    return {
      additionalLocationIds: locationIds,
      additionalTenantLocationIdsMap: tenantLocationIdsMap,
    };
  }, [locationId, currentReceivingTenantId]);

  return {
    receivingTenantIds: receivingTenants,
    tenantId: currentReceivingTenantId,
    ...additionalLocations,
  };
};
