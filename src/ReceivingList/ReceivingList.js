import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  matchPath,
  Route,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { get } from 'lodash';

import {
  checkScope,
  HasCommand,
  MultiColumnList,
  NoValue,
  TextLink,
} from '@folio/stripes/components';
import {
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import { PersistedPaneset } from '@folio/stripes/smart-components';
import {
  FiltersPane,
  FolioFormattedDate,
  handleKeyCommand,
  NoResultsMessage,
  ORDER_STATUS_LABEL,
  ResetButton,
  ResultsPane,
  SEARCH_PARAMETER,
  SingleSearchForm,
  PrevNextPagination,
  useFiltersReset,
  useFiltersToogle,
  useItemToView,
  useLocationFilters,
  useLocationSorting,
  useModalToggle,
} from '@folio/stripes-acq-components';

import TitleDetailsContainer from '../TitleDetails';
import { ExportSettingsModal } from './ExportSettingsModal';
import { ReceivingListActionMenu } from './ReceivingListActionMenu';
import ReceivingListFilter from './ReceivingListFilter';
import {
  searchableIndexes,
} from './ReceivingListSearchConfig';

const resultsPaneTitle = <FormattedMessage id="ui-receiving.meta.title" />;
const visibleColumns = [
  'title', 'poLine.physical.expectedReceiptDate',
  'poLine.titleOrPackage', 'poLine.poLineNumber',
  'poLine.receivingNote', 'locations', 'orderWorkflow',
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
  'orderWorkflow': <FormattedMessage id="ui-receiving.titles.orderWorkflow" />,
};

const getResultsFormatter = ({ search }) => ({
  'title': data => <TextLink to={`/receiving/${data.id}/view${search}`}>{data.title}</TextLink>,
  'poLine.physical.expectedReceiptDate': data => <FolioFormattedDate value={get(data, 'poLine.physical.expectedReceiptDate')} />,
  'poLine.titleOrPackage': data => (get(data, 'poLine.isPackage') ? get(data, 'poLine.titleOrPackage') : <NoValue />),
  'poLine.poLineNumber': data => get(data, 'poLine.poLineNumber'),
  'poLine.receivingNote': data => get(data, 'poLine.details.receivingNote') || <NoValue />,
  'locations': data => get(data, 'poLine.locations', []).join(', '),
  'orderWorkflow': title => ORDER_STATUS_LABEL[title.poLine?.orderWorkflow],
});

const ReceivingList = ({
  history,
  isLoading,
  location,
  match,
  onNeedMoreData,
  pagination,
  query,
  resetData,
  titles,
  titlesCount,
}) => {
  const intl = useIntl();
  const stripes = useStripes();
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
  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-receiving/filters');
  const [isExportModalOpened, toggleExportModal] = useModalToggle();

  useFiltersReset(resetFilters);

  const urlParams = useMemo(() => (
    matchPath(location.pathname, { path: `${match.path}/:id/view` })
  ), [location.pathname, match.path]);

  const isRowSelected = useCallback(({ item }) => {
    return urlParams && (urlParams.params.id === item.id);
  }, [urlParams]);

  const renderLastMenu = useCallback(({ onToggle }) => {
    return (
      <ReceivingListActionMenu
        onToggle={onToggle}
        titlesCount={titlesCount}
        toggleExportModal={toggleExportModal}
      />
    );
  }, [titlesCount, toggleExportModal]);

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  const shortcuts = [
    {
      name: 'new',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-receiving.create')) {
          history.push('/receiving/create');
        }
      }),
    },
  ];

  const { itemToView, setItemToView, deleteItemToView } = useItemToView('receivings-list');

  const queryFilter = filters?.[SEARCH_PARAMETER];
  const pageTitle = queryFilter ? intl.formatMessage({ id: 'ui-receiving.document.title.search' }, { query: queryFilter }) : null;

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <TitleManager page={pageTitle} />
      <PersistedPaneset
        appId="ui-receiving"
        id="receiving-paneset"
        data-test-titles-list
      >
        {isFiltersOpened && (
          <FiltersPane
            id="receiving-filters-pane"
            toggleFilters={toggleFilters}
          >
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
              disabled={!location.search || isLoading}
            />

            <ReceivingListFilter
              activeFilters={filters}
              applyFilters={applyFilters}
              disabled={isLoading}
            />
          </FiltersPane>
        )}

        <ResultsPane
          id="receiving-results-pane"
          autosize
          title={resultsPaneTitle}
          count={titlesCount}
          renderActionMenu={renderLastMenu}
          toggleFiltersPane={toggleFilters}
          filters={filters}
          isFiltersOpened={isFiltersOpened}
          isLoading={isLoading}
        >
          {(({ height, width }) => (
            <>
              <MultiColumnList
                id="receivings-list"
                totalCount={titlesCount}
                contentData={titles}
                visibleColumns={visibleColumns}
                columnMapping={columnMapping}
                formatter={getResultsFormatter({ search: location.search })}
                loading={isLoading}
                onNeedMoreData={onNeedMoreData}
                sortOrder={sortingField}
                sortDirection={sortingDirection}
                onHeaderClick={changeSorting}
                isEmptyMessage={resultsStatusMessage}
                hasMargin
                pagingType="none"
                height={height - PrevNextPagination.HEIGHT}
                width={width}
                isSelected={isRowSelected}
                itemToView={itemToView}
                onMarkPosition={setItemToView}
                onResetMark={deleteItemToView}
              />
              {titles.length > 0 && (
                <PrevNextPagination
                  {...pagination}
                  totalCount={titlesCount}
                  disabled={isLoading}
                  onChange={onNeedMoreData}
                />
              )}
            </>
          ))}
        </ResultsPane>

        {isExportModalOpened && (
          <ExportSettingsModal
            onCancel={toggleExportModal}
            query={query}
          />
        )}

        <Route
          path={`${match.path}/:id/view`}
          component={TitleDetailsContainer}
        />
      </PersistedPaneset>
    </HasCommand>
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
  pagination: PropTypes.object.isRequired,
  query: PropTypes.string,
};

ReceivingList.defaultProps = {
  titlesCount: 0,
  isLoading: false,
  titles: [],
};

export default withRouter(ReceivingList);
