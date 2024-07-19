import compact from 'lodash/compact';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import uniq from 'lodash/uniq';

import {
  batchRequest,
  buildArrayFieldQuery,
  buildDateRangeQuery,
  buildDateTimeRangeQuery,
  buildFilterQuery,
  buildSortingQuery,
  connectQuery,
  HOLDINGS_API,
  LIMIT_MAX,
  LINES_API,
  LOCATIONS_API,
  ORDERS_API,
} from '@folio/stripes-acq-components';

import {
  chunkRequests,
  fetchConsortiumInstanceHoldings,
  fetchConsortiumInstanceLocations,
  getConsortiumCentralTenantKy,
} from '../common/utils';
import {
  FILTERS,
  ORDER_FORMAT_MATERIAL_TYPE_MAP,
} from './constants';
import { getKeywordQuery } from './ReceivingListSearchConfig';

export const fetchTitleOrderLines = (ky, titles, fetchedOrderLinesMap) => {
  const orderLinesQuery = titles
    .filter(title => !fetchedOrderLinesMap[title.poLineId])
    .map(title => `id==${title.poLineId}`)
    .join(' or ');

  const searchParams = {
    limit: LIMIT_MAX,
    query: orderLinesQuery,
  };

  return orderLinesQuery
    ? (
      ky.get(LINES_API, { searchParams })
        .json()
        .then(({ poLines }) => poLines)
    )
    : Promise.resolve([]);
};

export const fetchOrderLineHoldings = (ky) => (orderLines) => {
  const holdingstoFetch = orderLines
    .reduce((acc, orderLine) => {
      return [...acc, ...(orderLine.locations || [])];
    }, [])
    .map(({ holdingId }) => holdingId)
    .filter(Boolean);

  return holdingstoFetch.length
    ? batchRequest(
      ({ params: searchParams }) => (
        ky.get(HOLDINGS_API, { searchParams })
          .json()
          .then(({ holdingsRecords }) => holdingsRecords)
      ),
      uniq(holdingstoFetch),
    )
    : Promise.resolve([]);
};

export const fetchConsortiumOrderLineHoldings = (ky, stripes) => async (orderLines) => {
  const instanceIds = [...new Set(
    orderLines
      .map(({ instanceId }) => instanceId)
      .filter(Boolean),
  )];

  return chunkRequests(
    instanceIds,
    (instanceId) => fetchConsortiumInstanceHoldings(
      getConsortiumCentralTenantKy(ky, stripes),
      {
        searchParams: { instanceId },
      },
    ),
  ).then((chunkedResponses) => {
    const orderLinesHoldingIdsSet = new Set(
      orderLines.flatMap(({ locations }) => {
        return map(locations, 'holdingId');
      }),
    );

    return chunkedResponses
      .flatMap(({ holdings }) => holdings)
      .filter(({ id }) => orderLinesHoldingIdsSet.has(id));
  });
};

export const fetchOrderLineLocations = (ky) => (orderLines, fetchedLocationsMap) => {
  const unfetchedLocations = orderLines
    .reduce((acc, orderLine) => {
      return [...acc, ...(orderLine.locations || []).filter(({ locationId }) => !fetchedLocationsMap[locationId])];
    }, [])
    .map(({ locationId }) => locationId);

  return unfetchedLocations.length
    ? batchRequest(
      ({ params: searchParams }) => (
        ky.get(LOCATIONS_API, { searchParams })
          .json()
          .then(({ locations }) => locations)
      ),
      uniq(unfetchedLocations),
    )
    : Promise.resolve([]);
};

export const fetchConsortiumOrderLineLocations = (ky, stripes) => (orderLines) => {
  return fetchConsortiumInstanceLocations(getConsortiumCentralTenantKy(ky, stripes))
    .then(({ locations }) => {
      const orderLinesLocationIdsSet = new Set(
        orderLines.flatMap(({ locations }) => {
          return map(locations, 'locationId');
        }).filter(Boolean),
      );

      return locations.filter(({ id }) => orderLinesLocationIdsSet.has(id));
    });
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

  const queryParamsFilterQuery = buildFilterQuery(
    queryParams,
    (query, qindex) => {
      if (qindex) {
        return `(${qindex}==*${query}*)`;
      }

      return getKeywordQuery(query);
    },
    {
      [FILTERS.DATE_CREATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.DATE_CREATED]),
      [FILTERS.DATE_UPDATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.DATE_UPDATED]),
      [FILTERS.PIECE_DATE_CREATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.PIECE_DATE_CREATED]),
      [FILTERS.PIECE_DATE_UPDATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.PIECE_DATE_UPDATED]),
      [FILTERS.EXPECTED_RECEIPT_DATE]: buildDateRangeQuery.bind(null, [FILTERS.EXPECTED_RECEIPT_DATE]),
      [FILTERS.RECEIVED_DATE]: buildDateRangeQuery.bind(null, [FILTERS.RECEIVED_DATE]),
      [FILTERS.RECEIPT_DUE]: buildDateRangeQuery.bind(null, [FILTERS.RECEIPT_DUE]),
      [FILTERS.LOCATION]: (filterValue) => `(${
        [FILTERS.LOCATION, 'poLine.searchLocationIds']
          .map((filterKey) => buildArrayFieldQuery(filterKey, filterValue))
          .join(' or ')
      })`,
      [FILTERS.POL_TAGS]: buildArrayFieldQuery.bind(null, [FILTERS.POL_TAGS]),
      [FILTERS.ACQUISITIONS_UNIT]: buildArrayFieldQuery.bind(null, [FILTERS.ACQUISITIONS_UNIT]),
    },
  );

  const filterQuery = compact([queryParamsFilterQuery, materialTypeFilterQuery]).join(' and ') || 'cql.allRecords=1';
  const sortingQuery = buildSortingQuery(queryParams, { 'poLine.poLineNumber': 'poLineNumber' }) || 'sortby title/sort.ascending';

  return connectQuery(filterQuery, sortingQuery);
};

export const fetchLinesOrders = (ky, lines, fetchedOrdersMap) => {
  const unfetched = lines
    .filter(({ purchaseOrderId }) => !fetchedOrdersMap[purchaseOrderId])
    .map(({ purchaseOrderId }) => purchaseOrderId)
    .filter(Boolean);

  return unfetched.length
    ? batchRequest(
      ({ params: searchParams }) => (
        ky.get(ORDERS_API, { searchParams })
          .json()
          .then(({ purchaseOrders }) => purchaseOrders)
      ),
      uniq(unfetched),
    )
    : Promise.resolve([]);
};
