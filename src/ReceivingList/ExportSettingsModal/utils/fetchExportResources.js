import {
  CONTRIBUTOR_NAME_TYPES_API,
  fetchExportDataByIds,
  HOLDINGS_API,
  IDENTIFIER_TYPES_API,
  ITEMS_API,
  LINES_API,
  LOCATIONS_API,
  ORDERS_API,
  VENDORS_API,
  USERS_API,
} from '@folio/stripes-acq-components';

import { mapUniqElements } from './mapUniqElements';

export const fetchPOLinesExportData = (ky) => (titles = []) => {
  const poLineIds = mapUniqElements(titles, ({ poLineId }) => poLineId);

  return fetchExportDataByIds({
    api: LINES_API,
    ids: poLineIds,
    ky,
    records: 'poLines',
  });
};

export const fetchIdentifierTypesExportData = (ky) => (titles = []) => {
  const identifierTypeIds = mapUniqElements(
    titles.map(({ productIds }) => (
      productIds.map(({ productIdType }) => productIdType)
    )),
  );

  return fetchExportDataByIds({
    api: IDENTIFIER_TYPES_API,
    ids: identifierTypeIds,
    ky,
    records: 'identifierTypes',
  });
};

export const fetchContributorNameTypesExportData = (ky) => (titles = []) => {
  const contributorNameTypeIds = mapUniqElements(
    titles.map(({ contributors }) => (
      contributors.map(({ contributorNameTypeId }) => contributorNameTypeId)
    )),
  );

  return fetchExportDataByIds({
    api: CONTRIBUTOR_NAME_TYPES_API,
    ids: contributorNameTypeIds,
    ky,
    records: 'contributorNameTypes',
  });
};

export const fetchPurchaseOrdesExportData = (ky) => (poLinesData = []) => {
  const purchaseOrderIds = mapUniqElements(poLinesData, ({ purchaseOrderId }) => purchaseOrderId);

  return fetchExportDataByIds({
    api: ORDERS_API,
    ids: purchaseOrderIds,
    ky,
    records: 'purchaseOrders',
  });
};

export const fetchVendorsExportData = (ky) => (purchaseOrdersData = []) => {
  const vendorIds = mapUniqElements(purchaseOrdersData, ({ vendor }) => vendor);

  return fetchExportDataByIds({
    api: VENDORS_API,
    ids: vendorIds,
    ky,
    records: 'organizations',
  });
};

export const fetchItemsExportData = (ky) => (piecesData = []) => {
  const itemIds = mapUniqElements(piecesData, ({ itemId }) => itemId);

  return fetchExportDataByIds({
    api: ITEMS_API,
    ids: itemIds,
    ky,
    records: 'items',
  });
};

export const fetchLocationsExportData = (ky) => async (piecesData) => {
  const holdingIds = mapUniqElements(piecesData, ({ holdingId }) => holdingId);
  const holdings = await fetchExportDataByIds({
    api: HOLDINGS_API,
    ids: holdingIds,
    ky,
    records: 'holdingsRecords',
  });

  const locationIds = mapUniqElements(piecesData, ({ locationId }) => locationId);
  const locations = await fetchExportDataByIds({
    api: LOCATIONS_API,
    ids: [...locationIds, ...holdings.map(({ permanentLocationId }) => permanentLocationId)],
    ky,
    records: 'locations',
  });

  return { holdings, locations };
};

export const fetchUsersExportData = (ky) => (titles = [], piecesData = []) => {
  const titlesMetadata = titles.map(({ metadata }) => metadata);
  const piecesMetadata = piecesData.map(({ metadata }) => metadata);
  const userIds = mapUniqElements(
    [...titlesMetadata, ...piecesMetadata],
    (metadata) => [metadata?.createdByUserId, metadata?.updatedByUserId],
  );

  return fetchExportDataByIds({
    api: USERS_API,
    ids: userIds,
    ky,
    records: 'users',
  });
};
