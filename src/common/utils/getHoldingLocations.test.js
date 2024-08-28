import { HOLDINGS_API } from '@folio/stripes-acq-components';

import {
  getHoldingLocations,
  getHoldingLocationsByTenants,
} from './getHoldingLocations';
import { extendKyWithTenant } from './utils';

jest.mock('./utils', () => ({
  extendKyWithTenant: jest.fn(),
}));

const holdingsRecords = [{
  id: 'holding-id',
  permanentLocationId: 'location-id',
}];

const locations = [{
  id: 'location-id',
  name: 'location-name',
}];

describe('utils', () => {
  let ky;

  beforeEach(() => {
    ky = {
      get: jest.fn((path) => {
        if (path === HOLDINGS_API) {
          return {
            json: jest.fn().mockResolvedValue({ holdingsRecords }),
          };
        }

        return ({
          json: jest.fn().mockResolvedValue({ locations }),
        });
      }),
    };
  });

  describe('getHoldingLocations', () => {
    it('should return holdings, locations and locationIds', async () => {
      const searchParams = {};
      const signal = { signal: 'signal' };

      const result = await getHoldingLocations({ ky, searchParams, signal });

      expect(result).toEqual({
        holdings: holdingsRecords,
        locations,
        locationIds: locations.map(({ id }) => id),
      });
    });

    it('should return holdings, locations and locationIds with tenantId', async () => {
      const searchParams = {};
      const signal = { signal: 'signal' };
      const tenantId = 'tenant-id';

      const result = await getHoldingLocations({ ky, searchParams, signal, tenantId });

      expect(result).toEqual({
        holdings: holdingsRecords.map(holding => ({ ...holding, tenantId })),
        locations: locations.map(location => ({ ...location, tenantId })),
        locationIds: locations.map(({ id }) => id),
      });
    });
  });

  describe('getHoldingLocationsByTenants', () => {
    beforeEach(() => {
      extendKyWithTenant.mockImplementation((tenantKy, tenantId) => {
        return { ...tenantKy, tenantId };
      });
    });

    it('should return locationsResponse', async () => {
      const instanceId = 'instance-id';
      const tenants = ['tenant-id'];

      const result = await getHoldingLocationsByTenants({ ky, instanceId, tenants });

      expect(result).toEqual({
        holdings: holdingsRecords.map(holding => ({ ...holding, tenantId: tenants[0] })),
        locations: locations.map(location => ({ ...location, tenantId: tenants[0] })),
        locationIds: locations.map(({ id }) => id),
      });
    });
  });
});
