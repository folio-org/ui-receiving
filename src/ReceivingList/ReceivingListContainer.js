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

import { stripesConnect } from '@folio/stripes/core';

import {
  titlesResource,
  orderLinesResource,
  locationsResource,
} from '../common/resources';
import ReceivingList from './ReceivingList';

import {
  fetchOrderLineLocations,
  fetchTitleOrderLines,
  buildTitlesQuery,
} from './utils';

const RESULT_COUNT_INCREMENT = 30;

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
        const orderLinesPromise = fetchTitleOrderLines(
          mutator.receivingListOrderLines, titlesResponse.titles, orderLinesMap,
        );

        return Promise.all([titlesResponse, orderLinesPromise]);
      })
      .then(([titlesResponse, orderLinesResponse]) => {
        const locationsPromise = fetchOrderLineLocations(
          mutator.receivingListLocations, orderLinesResponse, locationsMap,
        );

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
