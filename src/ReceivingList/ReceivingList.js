import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Paneset,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  FiltersPane,
  ResultsPane,
  ResetButton,
  SingleSearchForm,
  useLocationFilters,
  useLocationSorting,
} from '@folio/stripes-acq-components';

import ReceivingListFilter from './ReceivingListFilter';

const resultsPaneTitle = <FormattedMessage id="ui-receiving.meta.title" />;
const visibleColumns = ['title'];
const sortableFields = ['title'];
const columnMapping = {
  title: <FormattedMessage id="ui-receiving.titles.title" />,
};

const ReceivingList = ({
  history,
  isLoading,
  location,
  onNeedMoreData,
  resetData,
  titles,
  titlesCount,
}) => {
  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
  ] = useLocationFilters(location, history, resetData);
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, resetData, sortableFields);

  return (
    <Paneset>
      <FiltersPane>
        <SingleSearchForm
          applySearch={applySearch}
          changeSearch={changeSearch}
          searchQuery={searchQuery}
          isLoading={isLoading}
          ariaLabelId="ui-receiving.titles.search"
        />

        <ResetButton
          id="reset-receiving-filters"
          reset={resetFilters}
          disabled={!location.search}
        />

        <ReceivingListFilter
          activeFilters={filters}
          applyFilters={applyFilters}
        />
      </FiltersPane>

      <ResultsPane
        title={resultsPaneTitle}
        count={titlesCount}
      >
        <MultiColumnList
          id="receivings-list"
          totalCount={titlesCount}
          contentData={titles}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          loading={isLoading}
          autosize
          virtualize
          onNeedMoreData={onNeedMoreData}
          sortOrder={sortingField}
          sortDirection={sortingDirection}
          onHeaderClick={changeSorting}
        />
      </ResultsPane>
    </Paneset>
  );
};

ReceivingList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  titlesCount: PropTypes.number,
  isLoading: PropTypes.bool,
  titles: PropTypes.arrayOf(PropTypes.object),
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

ReceivingList.defaultProps = {
  titlesCount: 0,
  isLoading: false,
  titles: [],
};

export default withRouter(ReceivingList);
