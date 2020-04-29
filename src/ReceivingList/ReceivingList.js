import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Paneset,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  FiltersPane,
  FolioFormattedDate,
  ResetButton,
  ResultsPane,
  NoResultsMessage,
  SingleSearchForm,
  useLocationFilters,
  useLocationSorting,
  useToggle,
} from '@folio/stripes-acq-components';

import TitleDetailsContainer from '../TitleDetails';
import ReceivingListFilter from './ReceivingListFilter';
import { renderNewButton } from './renderNewButton';
import {
  searchableIndexes,
} from './ReceivingListSearchConfig';

const resultsPaneTitle = <FormattedMessage id="ui-receiving.meta.title" />;
const visibleColumns = [
  'title', 'poLine.physical.expectedReceiptDate',
  'poLine.titleOrPackage', 'poLine.poLineNumber',
  'poLine.receivingNote', 'locations',
];
const sortableFields = [
  'title', 'poLine.receiptDate',
  'poLine.titleOrPackage', 'poLine.poLineNumber',
  'poLine.receivingNote',
];
const columnMapping = {
  'title': <FormattedMessage id="ui-receiving.titles.title" />,
  'poLine.physical.expectedReceiptDate': <FormattedMessage id="ui-receiving.title.expectedReceiptDate" />,
  'poLine.titleOrPackage': <FormattedMessage id="ui-receiving.title.package" />,
  'poLine.poLineNumber': <FormattedMessage id="ui-receiving.title.polNumber" />,
  'poLine.receivingNote': <FormattedMessage id="ui-receiving.title.receivingNote" />,
  'locations': <FormattedMessage id="ui-receiving.title.locations" />,
};
const resultsFormatter = {
  'poLine.physical.expectedReceiptDate': data => <FolioFormattedDate value={get(data, 'poLine.physical.expectedReceiptDate')} />,
  'poLine.titleOrPackage': data => (get(data, 'poLine.isPackage') ? get(data, 'poLine.titleOrPackage') : ''),
  'poLine.poLineNumber': data => get(data, 'poLine.poLineNumber'),
  'poLine.receivingNote': data => get(data, 'poLine.details.receivingNote'),
  'locations': data => get(data, 'poLine.locations', []).join(', '),
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

  const renderLastMenu = useCallback(() => renderNewButton(location.search), [location.search]);

  const selectedTitle = useCallback(
    (e, { id }) => {
      history.push({
        pathname: `/receiving/${id}/view`,
        search: location.search,
      });
    },
    [history, location.search],
  );

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  return (
    <Paneset data-test-titles-list>
      {isFiltersOpened && (
        <FiltersPane toggleFilters={toggleFilters}>
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
        filters={filters}
        isFiltersOpened={isFiltersOpened}
      >
        <MultiColumnList
          id="receivings-list"
          totalCount={titlesCount}
          contentData={titles}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          formatter={resultsFormatter}
          loading={isLoading}
          autosize
          virtualize
          onNeedMoreData={onNeedMoreData}
          onRowClick={selectedTitle}
          sortOrder={sortingField}
          sortDirection={sortingDirection}
          onHeaderClick={changeSorting}
          isEmptyMessage={resultsStatusMessage}
          hasMargin
          pagingType="click"
        />
      </ResultsPane>

      <Route
        path={`${match.path}/:id/view`}
        component={TitleDetailsContainer}
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
