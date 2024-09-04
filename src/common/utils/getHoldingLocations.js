import {
  batchRequest,
  HOLDINGS_API,
  LIMIT_MAX,
  LOCATIONS_API,
} from '@folio/stripes-acq-components';

import { extendKyWithTenant } from './utils';

const DEFAULT_DATA = [];

export const getHoldingLocations = async ({ ky, searchParams, signal, tenantId }) => {
  const holdings = await ky
    .get(HOLDINGS_API, { searchParams, signal })
    .json()
    .then(response => {
      return tenantId ?
        response.holdingsRecords.map(holding => ({ ...holding, tenantId }))
        : response.holdingsRecords;
    });

  const locationIds = holdings?.map(({ permanentLocationId }) => permanentLocationId) || DEFAULT_DATA;

  const locations = await batchRequest(
    ({ params }) => ky.get(LOCATIONS_API, { searchParams: params, signal }).json(),
    locationIds,
  ).then(responses => responses.flatMap(response => {
    return tenantId
      ? response.locations.map(location => ({ ...location, tenantId }))
      : response.locations;
  }));

  return {
    holdings,
    locations,
    locationIds,
  };
};

export const getHoldingLocationsByTenants = async ({ ky, instanceId, receivingTenantIds = DEFAULT_DATA }) => {
  const searchParams = {
    query: `instanceId==${instanceId}`,
    limit: LIMIT_MAX,
  };

  const locationsRequest = receivingTenantIds.map(async (tenantId) => {
    const tenantKy = extendKyWithTenant(ky, tenantId);

    return getHoldingLocations({ ky: tenantKy, searchParams, tenantId });
  });

  const locationsResponse = await Promise.all(locationsRequest).then(responses => {
    return responses.reduce((acc, item) => {
      return {
        locations: acc.locations.concat(item.locations),
        locationIds: acc.locationIds.concat(item.locationIds),
        holdings: acc.holdings.concat(item.holdings),
      };
    }, { locations: DEFAULT_DATA, locationIds: DEFAULT_DATA, holdings: DEFAULT_DATA });
  });

  return locationsResponse;
};
