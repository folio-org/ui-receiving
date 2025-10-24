import {
  ALL_RECORDS_CQL,
  CONSORTIUM_LOCATIONS_API,
  CONTRIBUTOR_NAME_TYPES_API,
  fetchAllRecords,
  fetchConsortiumHoldingsByIds,
  fetchExportDataByIds,
  getConsortiumCentralTenantKy,
  HOLDINGS_API,
  IDENTIFIER_TYPES_API,
  LINES_API,
  LOCATIONS_API,
  ORDERS_API,
  USERS_API,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import {
  fetchConsortiumPiecesItems,
  fetchLocalPiecesItems,
} from '../../../common/utils';
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

export const fetchItemsExportData = (ky, { isCentralOrderingEnabled }) => (piecesData = []) => {
  return isCentralOrderingEnabled
    ? fetchConsortiumPiecesItems(ky)(piecesData)
    : fetchLocalPiecesItems(ky)(piecesData);
};

export const fetchLocationsExportData = (ky, { isCentralOrderingEnabled, stripes }) => async (piecesData) => {
  const holdingIds = mapUniqElements(piecesData, ({ holdingId }) => holdingId);

  const holdings = isCentralOrderingEnabled
    ? await fetchConsortiumHoldingsByIds(ky, stripes)(holdingIds).then((res) => res.holdings)
    : await fetchExportDataByIds({
      api: HOLDINGS_API,
      ids: holdingIds,
      ky,
      records: 'holdingsRecords',
    });

  const locationIds = [
    ...mapUniqElements(piecesData, ({ locationId }) => locationId),
    ...holdings.map(({ permanentLocationId }) => permanentLocationId),
  ];

  const locations = isCentralOrderingEnabled
    ? await fetchAllRecords({
      GET: async ({ params: searchParams }) => {
        return getConsortiumCentralTenantKy(ky, stripes)
          .get(CONSORTIUM_LOCATIONS_API, { searchParams })
          .json()
          .then((res) => res.locations);
      },
      ALL_RECORDS_CQL,
    })
    : await fetchExportDataByIds({
      api: LOCATIONS_API,
      ids: locationIds,
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
