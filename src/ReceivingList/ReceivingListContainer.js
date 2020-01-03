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
  makeQueryBuilder,
} from '@folio/stripes-acq-components';

import { titlesResource } from '../common/resources';

import ReceivingList from './ReceivingList';

const RESULT_COUNT_INCREMENT = 30;
const buildTitlesQuery = makeQueryBuilder(
  'cql.allRecords=1 sortby title',
  (query) => `(title=${query}*)`,
);

const resetData = () => {};

const ReceivingListContainer = ({ mutator, location }) => {
  const [titles, setTitles] = useState([]);
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
      .then(response => {
        if (!offset) setTitlesCount(response.totalRecords);

        setTitles((prev) => [...prev, ...response.titles]);
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
});

ReceivingListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(ReceivingListContainer));
