import { uniq, compact, flatten } from 'lodash';

import {
  LIMIT_MAX,
  batchFetch,
  buildFilterQuery,
  buildSortingQuery,
  connectQuery,
} from '@folio/stripes-acq-components';

import {
  FILTERS,
  ORDER_FORMAT_MATERIAL_TYPE_MAP,
} from './constants';
import {
  getKeywordQuery,
} from './ReceivingListSearchConfig';

export const fetchTitleOrderLines = (mutator, titles, fetchedOrderLinesMap) => {
  const orderLinesQuery = titles
    .filter(title => !fetchedOrderLinesMap[title.poLineId])
    .map(title => `id==${title.poLineId}`)
    .join(' or ');

  const orderLinesPromise = orderLinesQuery
    ? mutator.GET({
      params: {
        limit: LIMIT_MAX,
        query: orderLinesQuery,
      },
    })
    : Promise.resolve([]);

  return orderLinesPromise;
};

export const fetchOrderLineLocations = (mutator, orderLines, fetchedLocationsMap) => {
  const unfetchedLocations = orderLines
    .reduce((acc, orderLine) => {
      return [...acc, ...(orderLine.locations || []).filter(({ locationId }) => !fetchedLocationsMap[locationId])];
    }, [])
    .map(({ locationId }) => locationId);

  const locationsPromise = unfetchedLocations.length
    ? batchFetch(mutator, uniq(unfetchedLocations))
    : Promise.resolve([]);

  return locationsPromise;
};

export const buildTitlesQuery = (queryParams) => {
  let materialTypeFilterQuery;

  const materialType = queryParams[FILTERS.MATERIAL_TYPE];
  const orderFormat = queryParams[FILTERS.ORDER_FORMAT];

  if (materialType && orderFormat) {
    materialTypeFilterQuery = flatten([orderFormat]).map(format => {
      const orderFormatQuery = `poLine.orderFormat=="${format}"`;
      const materialTypeQuery = ORDER_FORMAT_MATERIAL_TYPE_MAP[format]
        .map(materialTypeCql => `${materialTypeCql}=="${materialType}"`)
        .join(' or ');

      return `(${orderFormatQuery} and (${materialTypeQuery}))`;
    }).join(' or ');
    materialTypeFilterQuery = `(${materialTypeFilterQuery})`;
  } else if (materialType) {
    materialTypeFilterQuery =
      `(poLine.eresource.materialType=="${materialType}" or poLine.physical.materialType=="${materialType}")`;
  }

  if (materialTypeFilterQuery) {
    queryParams[FILTERS.MATERIAL_TYPE] = undefined;
    queryParams[FILTERS.ORDER_FORMAT] = undefined;
  }

  const queryParamsFilterQuery = buildFilterQuery(queryParams, (query, qindex) => {
    if (qindex) {
      return `(${qindex}=${query}*)`;
    }

    return getKeywordQuery(query);
  });

  const filterQuery = compact([queryParamsFilterQuery, materialTypeFilterQuery]).join(' and ') || 'cql.allRecords=1';
  const sortingQuery = buildSortingQuery(queryParams) || 'sortby title/sort.ascending';

  return connectQuery(filterQuery, sortingQuery);
};
