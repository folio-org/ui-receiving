import { uniq } from 'lodash';

import {
  LIMIT_MAX,
  batchFetch,
} from '@folio/stripes-acq-components';

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
