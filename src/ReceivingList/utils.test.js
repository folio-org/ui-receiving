import '@folio/stripes-acq-components/test/jest/__mock__';
import {
  LIMIT_MAX,
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

import {
  FILTERS,
} from './constants';
import {
  fetchTitleOrderLines,
  fetchOrderLineLocations,
  buildTitlesQuery,
} from './utils';

describe('ReceivingList utils', () => {
  describe('fetchTitleOrderLines', () => {
    it('should make a request with correct query', () => {
      expect.assertions(1);

      const mutator = {
        GET: jest.fn(() => Promise.resolve()),
      };
      const titles = [{ poLineId: 1 }, { poLineId: 2 }, { poLineId: 3 }];
      const orderLinesMap = {
        '1': {},
      };

      fetchTitleOrderLines(mutator, titles, orderLinesMap)
        .then(() => {
          expect(mutator.GET).toHaveBeenCalledWith({
            params: {
              limit: LIMIT_MAX,
              query: 'id==2 or id==3',
            },
          });
        });
    });

    it('should not make a request for empty titles', () => {
      expect.assertions(2);

      const mutator = {
        GET: jest.fn(() => Promise.resolve()),
      };
      const orderLinesMap = {
        '1': {},
      };

      fetchTitleOrderLines(mutator, [], orderLinesMap)
        .then((response) => {
          expect(mutator.GET).not.toHaveBeenCalled();
          expect(response).toEqual([]);
        });
    });

    it('should not make a request if there are no new order lines', () => {
      expect.assertions(2);

      const mutator = {
        GET: jest.fn(() => Promise.resolve()),
      };
      const titles = [{ poLineId: 1 }];
      const orderLinesMap = {
        '1': {},
      };

      fetchTitleOrderLines(mutator, titles, orderLinesMap)
        .then((response) => {
          expect(mutator.GET).not.toHaveBeenCalled();
          expect(response).toEqual([]);
        });
    });
  });

  describe('fetchOrderLineLocations', () => {
    it('should make a request with correct query', () => {
      expect.assertions(1);

      const mutator = {
        GET: jest.fn(() => Promise.resolve()),
        reset: jest.fn(),
      };
      const orderLines = [{ locations: [{ locationId: 1 }] }, { locations: [{ locationId: 2 }, { locationId: 3 }] }];
      const locationsMap = {
        '1': {},
      };

      fetchOrderLineLocations(mutator, orderLines, locationsMap)
        .then(() => {
          expect(mutator.GET).toHaveBeenCalledWith({
            params: {
              limit: LIMIT_MAX,
              query: 'id==2 or id==3',
            },
          });
        });
    });

    it('should not make a request for empty titles', () => {
      expect.assertions(2);

      const mutator = {
        GET: jest.fn(() => Promise.resolve()),
      };
      const locationsMap = {
        '1': {},
      };

      fetchOrderLineLocations(mutator, [], locationsMap)
        .then((response) => {
          expect(mutator.GET).not.toHaveBeenCalled();
          expect(response).toEqual([]);
        });
    });

    it('should not make a request if there are no new order lines', () => {
      expect.assertions(2);

      const mutator = {
        GET: jest.fn(() => Promise.resolve()),
      };
      const orderLines = [{ locations: [{ locationId: 1 }] }];
      const locationsMap = {
        '1': {},
      };

      fetchOrderLineLocations(mutator, orderLines, locationsMap)
        .then((response) => {
          expect(mutator.GET).not.toHaveBeenCalled();
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
  });
});
