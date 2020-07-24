import React, {
  useCallback,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';

import { stripesConnect } from '@folio/stripes/core';
import { useList } from '@folio/stripes-acq-components';

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
  const [orderLinesMap, setOrderLinesMap] = useState({});
  const [locationsMap, setLocationsMap] = useState({});

  const loadTitles = useCallback((offset) => {
    return mutator.receivingListTitles.GET({
      params: {
        limit: RESULT_COUNT_INCREMENT,
        offset,
        query: buildTitlesQuery(queryString.parse(location.search)),
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const loadTitlesCB = useCallback((setTitles, titlesResponse) => {
    const orderLinesPromise = fetchTitleOrderLines(
      mutator.receivingListOrderLines, titlesResponse.titles, orderLinesMap,
    );

    return orderLinesPromise
      .then((orderLinesResponse) => {
        const locationsPromise = fetchOrderLineLocations(
          mutator.receivingListLocations, orderLinesResponse, locationsMap,
        );

        return Promise.all([orderLinesResponse, locationsPromise]);
      })
      .then(([orderLinesResponse, locationsResponse]) => {
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
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationsMap, orderLinesMap]);

  const {
    records: titles,
    recordsCount: titlesCount,
    isLoading,
    onNeedMoreData,
  } = useList(false, loadTitles, loadTitlesCB, RESULT_COUNT_INCREMENT);

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
