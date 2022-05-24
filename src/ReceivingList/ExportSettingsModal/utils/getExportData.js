import keyBy from 'lodash/keyBy';
import intersection from 'lodash/intersection';

import {
  fetchAllRecords,
  fetchExportDataByIds,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

import { TITLES_API } from '../../../common/constants';
import { FETCH_CONFIGS_MAP } from '../constants';
import {
  fetchContributorNameTypesExportData,
  fetchIdentifierTypesExportData,
  fetchItemsExportData,
  fetchLocationsExportData,
  fetchPOLinesExportData,
  fetchPurchaseOrdesExportData,
  fetchVendorsExportData,
} from './fetchExportResources';
import { mapUniqElements } from './mapUniqElements';

const buildQueryByTitleIds = (chunk) => chunk.map(id => `titleId=${id}`).join(' or ');

const getFetchConfigs = (exportFields) => {
  return Object.entries(FETCH_CONFIGS_MAP).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: intersection(exportFields, value).length > 0,
  }), {});
};

const keyById = (data) => keyBy(data, 'id');

export const getExportData = (ky) => async ({
  exportFields,
  query,
}) => {
  const fetchConfigs = getFetchConfigs(exportFields);

  const titles = await fetchAllRecords(
    {
      GET: ({ params: searchParams }) => (
        ky.get(TITLES_API, { searchParams })
          .json()
          .then(res => res?.titles)
      ),
    },
    query,
  );

  const fetchTitlesRelatedData = async () => {
    const poLinesData = fetchConfigs.poLines ? await fetchPOLinesExportData(ky)(titles) : [];
    const identifierTypes = fetchConfigs.identifierTypes ? await fetchIdentifierTypesExportData(ky)(titles) : [];
    const contributorNameTypes = fetchConfigs.contributorNameTypes
      ? await fetchContributorNameTypesExportData(ky)(titles)
      : [];
    const purchaseOrdersData = fetchConfigs.purchaseOrders ? await fetchPurchaseOrdesExportData(ky)(poLinesData) : [];
    const vendorsData = fetchConfigs.vendors ? await fetchVendorsExportData(ky)(purchaseOrdersData) : [];

    return {
      contributorNameTypesMap: keyById(contributorNameTypes),
      identifierTypesMap: keyById(identifierTypes),
      poLinesMap: keyById(poLinesData),
      purchaseOrdersMap: keyById(purchaseOrdersData),
      vendorsMap: keyById(vendorsData),
    };
  };

  const fetchPiecesRelatedData = async () => {
    const titleIds = mapUniqElements(titles, ({ id }) => id);
    const piecesData = await fetchExportDataByIds({
      api: ORDER_PIECES_API,
      buildQuery: buildQueryByTitleIds,
      ids: titleIds,
      ky,
      records: 'pieces',
    });

    const itemsData = fetchConfigs.items ? await fetchItemsExportData(ky)(piecesData) : [];
    const {
      holdings = [],
      locations = [],
    } = fetchConfigs.locations ? await fetchLocationsExportData(ky)(piecesData) : {};

    return {
      holdingsMap: keyById(holdings),
      itemsMap: keyById(itemsData),
      locationsMap: keyById(locations),
      pieces: piecesData,
    };
  };

  const [titlesRelatedData, piecesRelatedData] = await Promise.all([
    fetchTitlesRelatedData(),
    fetchPiecesRelatedData(),
  ]);

  return {
    titles,
    ...titlesRelatedData,
    ...piecesRelatedData,
  };
};
