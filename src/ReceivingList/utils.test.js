import {
  CONSORTIUM_LOCATIONS_API,
  HOLDINGS_API,
  LIMIT_MAX,
  LINES_API,
  LOCATIONS_API,
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

import { FILTERS } from './constants';
import {
  fetchConsortiumOrderLineHoldings,
  fetchConsortiumOrderLineLocations,
  fetchTitleOrderLines,
  fetchOrderLineHoldings,
  fetchOrderLineLocations,
  buildTitlesQuery,
} from './utils';
import { BATCH_IDENTIFIER_TYPE, CONSORTIUM_BATCH_HOLDINGS } from '../common/constants';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  getConsortiumCentralTenantId: jest.fn(() => 'centralTenantId'),
}));

describe('ReceivingList utils', () => {
  describe('fetchTitleOrderLines', () => {
    it('should make a request with correct query', () => {
      expect.assertions(1);

      const ky = {
        get: jest.fn(() => ({
          json: () => Promise.resolve({ poLines: [{ id: '1' }] }),
        })),
      };
      const titles = [{ poLineId: 1 }, { poLineId: 2 }, { poLineId: 3 }];
      const orderLinesMap = {
        '1': {},
      };

      fetchTitleOrderLines(ky, titles, orderLinesMap)
        .then(() => {
          expect(ky.get).toHaveBeenCalledWith(LINES_API, expect.objectContaining({
            searchParams: {
              limit: LIMIT_MAX,
              query: 'id==2 or id==3',
            },
          }));
        });
    });

    it('should not make a request for empty titles', () => {
      expect.assertions(2);

      const ky = {
        get: jest.fn(() => ({
          json: () => Promise.resolve({ poLines: [] }),
        })),
      };
      const orderLinesMap = {
        '1': {},
      };

      fetchTitleOrderLines(ky, [], orderLinesMap)
        .then((response) => {
          expect(ky.get).not.toHaveBeenCalled();
          expect(response).toEqual([]);
        });
    });

    it('should not make a request if there are no new order lines', () => {
      expect.assertions(2);

      const ky = {
        get: jest.fn(() => ({
          json: () => Promise.resolve({ poLines: [] }),
        })),
      };
      const titles = [{ poLineId: 1 }];
      const orderLinesMap = {
        '1': {},
      };

      fetchTitleOrderLines(ky, titles, orderLinesMap)
        .then((response) => {
          expect(ky.get).not.toHaveBeenCalled();
          expect(response).toEqual([]);
        });
    });
  });

  describe('fetchOrderLineLocations', () => {
    it('should make a request with correct query', () => {
      expect.assertions(1);

      const ky = {
        get: jest.fn(() => ({
          json: () => Promise.resolve({ locations: [] }),
        })),
      };
      const orderLines = [{ locations: [{ locationId: 1 }] }, { locations: [{ locationId: 2 }, { locationId: 3 }] }];
      const locationsMap = {
        '1': {},
      };

      fetchOrderLineLocations(ky)(orderLines, locationsMap)
        .then(() => {
          expect(ky.get).toHaveBeenCalledWith(LOCATIONS_API, expect.objectContaining({
            searchParams: {
              limit: LIMIT_MAX,
              query: 'id==2 or id==3',
            },
          }));
        });
    });

    it('should not make a request for empty titles', () => {
      expect.assertions(2);

      const ky = {
        get: jest.fn(() => ({
          json: () => Promise.resolve({ locations: [] }),
        })),
      };
      const locationsMap = {
        '1': {},
      };

      fetchOrderLineLocations(ky)([], locationsMap)
        .then((response) => {
          expect(ky.get).not.toHaveBeenCalled();
          expect(response).toEqual([]);
        });
    });

    it('should not make a request if there are no new order lines', () => {
      expect.assertions(2);

      const ky = {
        get: jest.fn(() => ({
          json: () => Promise.resolve({ locations: [] }),
        })),
      };
      const orderLines = [{ locations: [{ locationId: 1 }] }];
      const locationsMap = {
        '1': {},
      };

      fetchOrderLineLocations(ky)(orderLines, locationsMap)
        .then((response) => {
          expect(ky.get).not.toHaveBeenCalled();
          expect(response).toEqual([]);
        });
    });
  });

  describe('fetchOrderLineHoldings', () => {
    it('should make a request with correct query', () => {
      expect.assertions(1);

      const ky = {
        get: jest.fn(() => ({
          json: () => Promise.resolve({ holdingsRecords: [] }),
        })),
      };
      const orderLines = [{ locations: [{ holdingId: 1 }] }, { locations: [{ holdingId: 2 }, { holdingId: 3 }] }];

      fetchOrderLineHoldings(ky)(orderLines)
        .then(() => {
          expect(ky.get).toHaveBeenCalledWith(HOLDINGS_API, expect.objectContaining({
            searchParams: {
              limit: LIMIT_MAX,
              query: 'id==1 or id==2 or id==3',
            },
          }));
        });
    });

    it('should not make a request for empty titles', () => {
      expect.assertions(2);

      const ky = {
        get: jest.fn(() => ({
          json: () => Promise.resolve({ holdingsRecords: [] }),
        })),
      };

      fetchOrderLineHoldings(ky)([])
        .then((response) => {
          expect(ky.get).not.toHaveBeenCalled();
          expect(response).toEqual([]);
        });
    });
  });

  describe('buildTitlesQuery', () => {
    it('should not include material type when it is not defined in query params', () => {
      const queryParams = { [FILTERS.ORDER_FORMAT]: 'orderFormat' };
      const titlesQuery = buildTitlesQuery(queryParams);

      expect(titlesQuery.includes('eresource.materialType')).toBeFalsy();
      expect(titlesQuery.includes('physical.materialType')).toBeFalsy();
    });

    it('should include material type for eresource when it is defined', () => {
      const queryParams = {
        [FILTERS.ORDER_FORMAT]: ORDER_FORMATS.electronicResource,
        [FILTERS.MATERIAL_TYPE]: 'materialTypeId',
      };
      const titlesQuery = buildTitlesQuery(queryParams);

      expect(titlesQuery.includes('eresource.materialType')).toBeTruthy();
      expect(titlesQuery.includes('physical.materialType')).toBeFalsy();
    });

    it('should include material type for physical when it is defined', () => {
      const queryParams = {
        [FILTERS.ORDER_FORMAT]: ORDER_FORMATS.physicalResource,
        [FILTERS.MATERIAL_TYPE]: 'materialTypeId',
      };
      const titlesQuery = buildTitlesQuery(queryParams);

      expect(titlesQuery.includes('eresource.materialType')).toBeFalsy();
      expect(titlesQuery.includes('physical.materialType')).toBeTruthy();
    });

    it('should include material type for physical and electroni when it is defined', () => {
      const queryParams = {
        [FILTERS.ORDER_FORMAT]: ORDER_FORMATS.PEMix,
        [FILTERS.MATERIAL_TYPE]: 'materialTypeId',
      };
      const titlesQuery = buildTitlesQuery(queryParams);

      expect(titlesQuery.includes('eresource.materialType')).toBeTruthy();
      expect(titlesQuery.includes('physical.materialType')).toBeTruthy();
    });

    it('should include material type for other when it is defined', () => {
      const queryParams = {
        [FILTERS.ORDER_FORMAT]: ORDER_FORMATS.other,
        [FILTERS.MATERIAL_TYPE]: 'materialTypeId',
      };
      const titlesQuery = buildTitlesQuery(queryParams);

      expect(titlesQuery.includes('eresource.materialType')).toBeFalsy();
      expect(titlesQuery.includes('physical.materialType')).toBeTruthy();
    });

    it('should return search query based on location filter', () => {
      const query = buildTitlesQuery({ [FILTERS.LOCATION]: 'locationId' });

      expect(query).toContain('(poLine.locations=="*locationId*" or poLine.searchLocationIds=="*locationId*")');
    });
  });

  describe('ECS mode', () => {
    describe('fetchConsortiumOrderLineHoldings', () => {
      it('should fetch order line holdings from consortium tenants', async () => {
        const ky = {
          extend: () => ky,
          post: jest.fn(() => ({
            json: () => Promise.resolve({ holdings: [] }),
          })),
        };

        const orderLines = [
          {
            instanceId: 'instanceId-1',
            locations: [{ holdingId: 1 }],
          },
          {
            instanceId: 'instanceId-2',
            locations: [{ holdingId: 2 }],
          },
          {
            instanceId: 'instanceId-2',
            locations: [{ holdingId: 3 }],
          },
        ];

        await fetchConsortiumOrderLineHoldings(ky, {})(orderLines);

        expect(ky.post).toHaveBeenCalledWith(
          CONSORTIUM_BATCH_HOLDINGS,
          {
            json: {
              identifierType: BATCH_IDENTIFIER_TYPE.instanceId,
              identifierValues: [...new Set(orderLines.map(({ instanceId }) => instanceId))],
            },
          },
        );
      });
    });

    describe('fetchConsortiumOrderLineLocations', () => {
      it('should fetch order line locations from consortium tenants', async () => {
        const ky = {
          extend: () => ky,
          get: jest.fn(() => ({
            json: () => Promise.resolve({ locations: [] }),
          })),
        };

        const orderLines = [
          {
            instanceId: 'instanceId-1',
            locations: [{
              locationId: 1,
              tenantId: 'central',
            }],
          },
          {
            instanceId: 'instanceId-2',
            locations: [{
              locationId: 2,
              tenantId: 'member',
            }],
          },
          {
            instanceId: 'instanceId-3',
            locations: [{
              locationId: 3,
              tenantId: 'member',
            }],
          },
        ];

        fetchConsortiumOrderLineLocations(ky, {})(orderLines).then(() => {
          expect(ky.get).toHaveBeenCalledTimes(1);
          expect(ky.get).toHaveBeenNthCalledWith(1, CONSORTIUM_LOCATIONS_API, {});
        });
      });
    });
  });
});
