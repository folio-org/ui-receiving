import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
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
  useToggle,
} from '@folio/stripes-acq-components';

import TitleDetailsContainer from '../TitleDetails';
import ReceivingListFilter from './ReceivingListFilter';
import { renderNewButton } from './renderNewButton';
import { TitleEditContainer } from '../TitleEdit';
import {
  searchableIndexes,
} from './ReceivingListSearchConfig';

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
  match,
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
    changeIndex,
    searchIndex,
  ] = useLocationFilters(location, history, resetData);
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, resetData, sortableFields);
  const [isFiltersOpened, toggleFilters] = useToggle(true);

  const renderLastMenu = useCallback(renderNewButton, []);

  const selectedTitle = useCallback(
    (e, { id }) => {
      history.push({
        pathname: `/receiving/${id}/view`,
        search: location.search,
      });
    },
    [history, location.search],
  );

  return (
    <Paneset>
      {isFiltersOpened && (
        <FiltersPane>
          <SingleSearchForm
            applySearch={applySearch}
            changeSearch={changeSearch}
            searchQuery={searchQuery}
            isLoading={isLoading}
            ariaLabelId="ui-receiving.titles.search"
            searchableIndexes={searchableIndexes}
            changeSearchIndex={changeIndex}
            selectedIndex={searchIndex}
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
      )}

      <ResultsPane
        title={resultsPaneTitle}
        count={titlesCount}
        renderLastMenu={renderLastMenu}
        toggleFiltersPane={toggleFilters}
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
          onRowClick={selectedTitle}
          sortOrder={sortingField}
          sortDirection={sortingDirection}
          onHeaderClick={changeSorting}
        />
      </ResultsPane>

      <Route
        path={`${match.path}/:id/view`}
        component={TitleDetailsContainer}
      />
      <Route
        path={`${match.path}/:id/edit`}
        component={TitleEditContainer}
      />
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
  match: ReactRouterPropTypes.match.isRequired,
};

ReceivingList.defaultProps = {
  titlesCount: 0,
  isLoading: false,
  titles: [],
};

export default withRouter(ReceivingList);
