import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';
import { uniq } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import {
  batchFetch,
  makeQueryBuilder,
} from '@folio/stripes-acq-components';

import {
  titlesResource,
  orderLinesResource,
  locationsResource,
} from '../common/resources';
import {
  getKeywordQuery,
} from './ReceivingListSearchConfig';
import ReceivingList from './ReceivingList';

const RESULT_COUNT_INCREMENT = 30;
const buildTitlesQuery = makeQueryBuilder(
  'cql.allRecords=1',
  (query, qindex) => {
    if (qindex) {
      return `(${qindex}=${query}*)`;
    }

    return getKeywordQuery(query);
  },
  'sortby title/sort.ascending',
);

const resetData = () => {};

const ReceivingListContainer = ({ mutator, location }) => {
  const [titles, setTitles] = useState([]);
  const [orderLinesMap, setOrderLinesMap] = useState({});
  const [locationsMap, setLocationsMap] = useState({});
  const [titlesCount, setTitlesCount] = useState(0);
  const [titlesOffset, setTitlesOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadTitles = (offset) => {
    setIsLoading(true);

    return mutator.receivingListTitles.GET({
      params: {
        limit: RESULT_COUNT_INCREMENT,
        offset,
        query: buildTitlesQuery(queryString.parse(location.search)),
      },
    })
      .then(titlesResponse => {
        const orderLinesQuery = titlesResponse.titles
          .filter(title => !orderLinesMap[title.poLineId])
          .map(title => `id==${title.poLineId}`)
          .join(' or ');

        const orderLinesPromise = orderLinesQuery
          ? mutator.receivingListOrderLines.GET({
            params: {
              limit: RESULT_COUNT_INCREMENT,
              query: orderLinesQuery,
            },
          })
          : Promise.resolve([]);

        return Promise.all([titlesResponse, orderLinesPromise]);
      })
      .then(([titlesResponse, orderLinesResponse]) => {
        const unfetchedLocations = orderLinesResponse
          .reduce((acc, orderLine) => {
            return [...acc, ...(orderLine.locations || []).filter(({ locationId }) => !locationsMap[locationId])];
          }, [])
          .map(({ locationId }) => locationId);

        const locationsPromise = unfetchedLocations.length
          ? batchFetch(mutator.receivingListLocations, uniq(unfetchedLocations))
          : Promise.resolve([]);

        return Promise.all([titlesResponse, orderLinesResponse, locationsPromise]);
      })
      .then(([titlesResponse, orderLinesResponse, locationsResponse]) => {
        if (!offset) setTitlesCount(titlesResponse.totalRecords);

        const newLocationsMap = {
          ...locationsMap,
          ...locationsResponse.reduce((acc, locationItem) => {
            acc[locationItem.id] = locationItem;

            return acc;
          }, {}),
        };

        const newOrderLinesMap = {
          ...orderLinesMap,
          ...orderLinesResponse.reduce((acc, orderLine) => {
            acc[orderLine.id] = {
              ...orderLine,
              locations: orderLine.locations.map(({ locationId }) => newLocationsMap[locationId].name),
            };

            return acc;
          }, {}),
        };

        setOrderLinesMap(newOrderLinesMap);
        setLocationsMap(newLocationsMap);

        setTitles((prev) => [
          ...prev,
          ...titlesResponse.titles.map(title => ({
            ...title,
            poLine: newOrderLinesMap[title.poLineId],
          })),
        ]);
      })
      .finally(() => setIsLoading(false));
  };

  const onNeedMoreData = useCallback(
    () => {
      const newOffset = titlesOffset + RESULT_COUNT_INCREMENT;

      loadTitles(newOffset)
        .then(() => {
          setTitlesOffset(newOffset);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [titlesOffset],
  );

  useEffect(
    () => {
      setTitles([]);
      setTitlesOffset(0);
      loadTitles(0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  return (
    <ReceivingList
      onNeedMoreData={onNeedMoreData}
      resetData={resetData}
      titlesCount={titlesCount}
      isLoading={isLoading}
      titles={titles}
    />
  );
};

ReceivingListContainer.manifest = Object.freeze({
  receivingListTitles: titlesResource,
  receivingListOrderLines: orderLinesResource,
  receivingListLocations: locationsResource,
});

ReceivingListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(ReceivingListContainer));
