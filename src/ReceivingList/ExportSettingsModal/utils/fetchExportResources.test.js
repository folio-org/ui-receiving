import {
  CONTRIBUTOR_NAME_TYPES_API,
  fetchExportDataByIds,
  IDENTIFIER_TYPES_API,
  ITEMS_API,
  LINES_API,
  LOCATIONS_API,
  ORDERS_API,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import { HOLDINGS_API } from '../../../common/constants';
import {
  fetchContributorNameTypesExportData,
  fetchIdentifierTypesExportData,
  fetchItemsExportData,
  fetchLocationsExportData,
  fetchPOLinesExportData,
  fetchPurchaseOrdesExportData,
  fetchVendorsExportData,
} from './fetchExportResources';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  fetchExportDataByIds: jest.fn(() => []),
}));

const kyMock = jest.fn();

const purchaseOrders = [{
  id: 'purchaseOrderId',
  vendor: 'vendorId',
}];
const pieces = [{
  holdingId: 'holdingId',
  itemId: 'itemId',
  locationId: 'locationId',
}];
const poLines = [{
  contributors: [{ contributorNameTypeId: 'contributorNameTypeId' }],
  purchaseOrderId: 'purchaseOrderId',
}];
const titles = [{
  productIds: [{ productIdType: 'productIdType' }],
  poLineId: 'poLineId',
}];

describe('fetchExportResources', () => {
  beforeEach(() => {
    fetchExportDataByIds.mockClear();
    kyMock.mockClear();
  });

  describe('fetchContributorNameTypesExportData', () => {
    it('should fetch contributor name types by ids', async () => {
      await fetchContributorNameTypesExportData(kyMock)(poLines);

      expect(fetchExportDataByIds).toHaveBeenCalledWith(expect.objectContaining({
        api: CONTRIBUTOR_NAME_TYPES_API,
        ids: ['contributorNameTypeId'],
      }));
    });
  });

  describe('fetchIdentifierTypesExportData', () => {
    it('should fetch identifier types by ids', async () => {
      await fetchIdentifierTypesExportData(kyMock)(titles);

      expect(fetchExportDataByIds).toHaveBeenCalledWith(expect.objectContaining({
        api: IDENTIFIER_TYPES_API,
        ids: ['productIdType'],
      }));
    });
  });

  describe('fetchItemsExportData', () => {
    it('should fetch items by ids', async () => {
      await fetchItemsExportData(kyMock)(pieces);

      expect(fetchExportDataByIds).toHaveBeenCalledWith(expect.objectContaining({
        api: ITEMS_API,
        ids: ['itemId'],
      }));
    });
  });

  describe('fetchLocationsExportData', () => {
    it('should fetch pieces holdings and locations by ids', async () => {
      await fetchLocationsExportData(kyMock)(pieces);

      expect(fetchExportDataByIds).toHaveBeenNthCalledWith(1, expect.objectContaining({
        api: HOLDINGS_API,
        ids: ['holdingId'],
      }));
      expect(fetchExportDataByIds).toHaveBeenNthCalledWith(2, expect.objectContaining({
        api: LOCATIONS_API,
        ids: ['locationId'],
      }));
    });
  });

  describe('fetchPOLinesExportData', () => {
    it('should fetch PO Lines by ids', async () => {
      await fetchPOLinesExportData(kyMock)(titles);

      expect(fetchExportDataByIds).toHaveBeenCalledWith(expect.objectContaining({
        api: LINES_API,
        ids: ['poLineId'],
      }));
    });
  });

  describe('fetchPurchaseOrdesExportData', () => {
    it('should fetch POs by ids', async () => {
      await fetchPurchaseOrdesExportData(kyMock)(poLines);

      expect(fetchExportDataByIds).toHaveBeenCalledWith(expect.objectContaining({
        api: ORDERS_API,
        ids: ['purchaseOrderId'],
      }));
    });
  });

  describe('fetchVendorsExportData', () => {
    it('should fetch vendors by ids', async () => {
      await fetchVendorsExportData(kyMock)(purchaseOrders);

      expect(fetchExportDataByIds).toHaveBeenCalledWith(expect.objectContaining({
        api: VENDORS_API,
        ids: ['vendorId'],
      }));
    });
  });
});
