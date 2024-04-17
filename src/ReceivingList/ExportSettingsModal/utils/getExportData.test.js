import keyBy from 'lodash/keyBy';

import {
  EXPORT_PIECE_FIELDS,
  EXPORT_TITLE_FIELDS,
} from '../constants';
import {
  fetchContributorNameTypesExportData,
  fetchIdentifierTypesExportData,
  fetchItemsExportData,
  fetchLocationsExportData,
  fetchPOLinesExportData,
  fetchPurchaseOrdesExportData,
  fetchVendorsExportData,
  fetchUsersExportData,
} from './fetchExportResources';
import { getExportData } from './getExportData';

jest.mock('./fetchExportResources');

const kyMock = {
  get: () => ({
    json: jest.fn(),
  }),
};
const params = {
  exportFields: [...Object.keys(EXPORT_TITLE_FIELDS), ...Object.keys(EXPORT_PIECE_FIELDS)],
  query: 'cql.allRecords=1',
};

const mockContributorNameTypes = [{ id: 'contributorNameTypeId' }];
const mockIdentifierTypes = [{ id: 'identifierTypeId' }];
const mockItems = [{ id: 'itemId' }];
const mockLocations = {
  holdings: [{ id: 'holdingId' }],
  locations: [{ id: 'locationId' }],
};
const mockPOLines = [{ id: 'poLineId' }];
const mockPOs = [{ id: 'poId' }];
const mockVendors = [{ id: 'vendorId' }];

describe('getExportData', () => {
  beforeEach(() => {
    fetchContributorNameTypesExportData.mockClear().mockReturnValue(async () => mockContributorNameTypes);
    fetchIdentifierTypesExportData.mockClear().mockReturnValue(async () => mockIdentifierTypes);
    fetchItemsExportData.mockClear().mockReturnValue(async () => mockItems);
    fetchLocationsExportData.mockClear().mockReturnValue(async () => mockLocations);
    fetchPOLinesExportData.mockClear().mockReturnValue(async () => mockPOLines);
    fetchPurchaseOrdesExportData.mockClear().mockReturnValue(async () => mockPOs);
    fetchVendorsExportData.mockClear().mockReturnValue(async () => mockVendors);
    fetchUsersExportData.mockClear().mockReturnValue(async () => {});
  });

  it('should return fetch and export data for each field', async () => {
    const exportData = await getExportData(kyMock)(params);

    expect(exportData).toEqual(expect.objectContaining({
      contributorNameTypesMap: keyBy(mockContributorNameTypes, 'id'),
      identifierTypesMap: keyBy(mockIdentifierTypes, 'id'),
      itemsMap: keyBy(mockItems, 'id'),
      poLinesMap: keyBy(mockPOLines, 'id'),
    }));
  });
});
