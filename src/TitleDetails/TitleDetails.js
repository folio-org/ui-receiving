import {
  useCallback,
  useMemo,
  useState,
  useRef,
} from 'react';
import {
  get,
  noop,
  omit,
} from 'lodash';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Accordion,
  AccordionStatus,
  AccordionSet,
  Button,
  checkScope,
  Col,
  collapseAllSections,
  ConfirmationModal,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  MessageBanner,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import {
  IfPermission,
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import {
  ColumnManager,
  ViewMetaData,
  useColumnManager,
} from '@folio/stripes/smart-components';
import {
  FilterSearchInput,
  handleKeyCommand,
  ORDER_FORMATS,
  ORDER_STATUSES,
  PIECE_STATUS,
  RoutingListAccordion,
  useAcqRestrictions,
  useFilters,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  CENTRAL_RECEIVING_PIECE_CREATE_ROUTE,
  CENTRAL_RECEIVING_PIECE_EDIT_ROUTE,
  CENTRAL_RECEIVING_ROUTE,
  CENTRAL_RECEIVING_ROUTE_CREATE,
  RECEIVING_PIECE_CREATE_ROUTE,
  RECEIVING_PIECE_EDIT_ROUTE,
  RECEIVING_ROUTE,
  RECEIVING_ROUTE_CREATE,
  ROUTING_LIST_ROUTE,
} from '../constants';
import { useReceivingSearchContext } from '../contexts';
import {
  EXPECTED_PIECES_SEARCH_VALUE,
  EXPECTED_PIECE_COLUMN_MAPPING,
  MENU_FILTERS,
  ORDER_FORMAT_TO_PIECE_FORMAT,
  RECEIVED_PIECE_COLUMN_MAPPING,
  UNRECEIVABLE_PIECE_COLUMN_MAPPING,
} from '../Piece';
import {
  TITLE_ACCORDION,
  TITLE_ACCORDION_LABELS,
} from './constants';
// import AddPieceModal from './AddPieceModal';
import { BoundItemsList } from './BoundItemsList';
import ExpectedPiecesList from './ExpectedPiecesList';
import POLDetails from './POLDetails';
import ReceivedPiecesList from './ReceivedPiecesList';
import Title from './Title';
import {
  TitleDetailsExpectedActions,
  TitleDetailsReceivedActions,
  TitleDetailsUnreceivableActions,
} from './TitleDetailsActions';
import TitleInformation from './TitleInformation';
import { UnreceivablePiecesList } from './UnreceivablePiecesList';

import css from './TitleDetails.css';

function getNewPieceValues(titleId, poLine, crossTenant) {
  const { orderFormat, id: poLineId, physical, locations, checkinItems } = poLine;
  const initialValuesPiece = { receiptDate: physical?.expectedReceiptDate, poLineId, titleId };

  if (orderFormat !== ORDER_FORMATS.PEMix) {
    initialValuesPiece.format = ORDER_FORMAT_TO_PIECE_FORMAT[orderFormat];
  }

  if (locations.length === 1 && !crossTenant) {
    initialValuesPiece.locationId = locations[0].locationId;
    initialValuesPiece.holdingId = locations[0].holdingId;
  }

  if (checkinItems) {
    initialValuesPiece.displayOnHolding = true;
  }

  return initialValuesPiece;
}

const TitleDetails = ({
  crossTenant = false,
  history,
  location,
  onClose,
  onEdit,
  order,
  piecesExistence,
  poLine,
  title,
  vendorsMap = {},
}) => {
  const intl = useIntl();
  const stripes = useStripes();
  const [isAcknowledgeNote, toggleAcknowledgeNote] = useModalToggle();
  const [isAddPieceModalOpened, toggleAddPieceModal] = useModalToggle();
  const [pieceValues, setPieceValues] = useState({});
  const [confirmAcknowledgeNote, setConfirmAcknowledgeNote] = useState();
  const [isConfirmReceiving, toggleConfirmReceiving] = useModalToggle();
  const confirmReceivingPromise = useRef({});
  const accordionStatusRef = useRef();
  const receivingNote = get(poLine, 'details.receivingNote');

  const {
    isCentralRouting,
    targetTenantId,
  } = useReceivingSearchContext();

  const { id: poLineId, physical, poLineNumber, checkinItems, orderFormat, requester, rush } = poLine;
  const titleId = title.id;
  const isOrderClosed = order.workflowStatus === ORDER_STATUSES.closed;
  const showRoutingList = orderFormat === ORDER_FORMATS.PEMix || orderFormat === ORDER_FORMATS.physicalResource;
  const numberOfPhysicalUnits = useMemo(() => {
    return poLine?.locations?.reduce((acc, { quantityPhysical = 0 }) => acc + quantityPhysical, 0);
  }, [poLine?.locations]);
  const vendor = vendorsMap[order?.vendor];
  const accessProvider = vendorsMap[poLine?.eresource?.accessProvider];
  const materialSupplier = vendorsMap[poLine?.physical?.materialSupplier];

  const {
    restrictions,
    isLoading: isRestrictionsLoading,
  } = useAcqRestrictions(
    titleId,
    title.acqUnitIds,
    { tenantId: targetTenantId },
  );

  const isRestrictedByAcqUnit = isRestrictionsLoading || restrictions?.protectUpdate;
  const isPiecesLock = !checkinItems && order.workflowStatus === ORDER_STATUSES.pending;
  const isBinderyActive = get(poLine, 'details.isBinderyActive', false);

  const acknowledgeNoteModalLabel = intl.formatMessage({ id: 'ui-receiving.piece.receivingNoteModal.title' });

  const {
    visibleColumns: expectedPiecesVisibleColumns,
    toggleColumn: toggleExpectedPiecesColumn,
  } = useColumnManager('expected-pieces-column-manager', EXPECTED_PIECE_COLUMN_MAPPING);
  const {
    visibleColumns: receivedPiecesVisibleColumns,
    toggleColumn: toggleReceivedPiecesColumn,
  } = useColumnManager('received-pieces-column-manager', RECEIVED_PIECE_COLUMN_MAPPING);

  const shortcuts = [
    {
      name: 'new',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-receiving.create')) {
          history.push(isCentralRouting ? CENTRAL_RECEIVING_ROUTE_CREATE : RECEIVING_ROUTE_CREATE);
        }
      }),
    },
    {
      name: 'edit',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-receiving.edit')) onEdit();
      }, { disabled: isRestrictedByAcqUnit }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

  const openAddPieceModal = useCallback(
    (e, piece) => {
      setPieceValues(piece || getNewPieceValues(title.id, poLine, crossTenant));
      setConfirmAcknowledgeNote(() => toggleAddPieceModal);

      return (
        title.isAcknowledged
          ? toggleAcknowledgeNote()
          : toggleAddPieceModal()
      );
    },
    [
      crossTenant,
      poLine,
      title.id,
      title.isAcknowledged,
      toggleAcknowledgeNote,
      toggleAddPieceModal,
    ],
  );

  const openEditReceivedPieceModal = useCallback(
    (e, piece) => {
      setPieceValues(piece);
      toggleAddPieceModal();
    },
    [toggleAddPieceModal],
  );

  const goToReceiveList = useCallback(
    () => {
      history.push({
        pathname: `${isCentralRouting ? CENTRAL_RECEIVING_ROUTE : RECEIVING_ROUTE}/receive/${titleId}`,
        search: location.search,
      });
    },
    [titleId, history, isCentralRouting, location.search],
  );

  const onPieceCreate = useCallback(() => {
    history.push({
      pathname: (isCentralRouting ? CENTRAL_RECEIVING_PIECE_CREATE_ROUTE : RECEIVING_PIECE_CREATE_ROUTE).replace(':id', titleId),
      search: location.search,
    });
  }, [history, isCentralRouting, location.search, titleId]);

  const onPieceEdit = useCallback((_, piece) => {
    const pathname = (isCentralRouting ? CENTRAL_RECEIVING_PIECE_EDIT_ROUTE : RECEIVING_PIECE_EDIT_ROUTE)
      .replace(':id', titleId)
      .replace(':pieceId', piece.id);

    history.push({
      pathname,
      search: location.search,
    });
  }, [history, isCentralRouting, location.search, titleId]);

  const openReceiveList = useCallback(
    () => {
      setConfirmAcknowledgeNote(() => goToReceiveList);

      return (
        title.isAcknowledged
          ? toggleAcknowledgeNote()
          : goToReceiveList()
      );
    },
    [title.isAcknowledged, toggleAcknowledgeNote, goToReceiveList],
  );

  const onCreateAnotherPiece = useCallback(piece => {
    const pieceFormValues = {
      ...omit(piece, ['id', 'itemId', 'receivingStatus', 'receivedDate']),
      isCreateItem: piece?.itemId ? true : piece?.isCreateItem,
      isCreateAnother: true,
    };

    setPieceValues(pieceFormValues);
    toggleAddPieceModal();
  }, [setPieceValues, toggleAddPieceModal]);

  const confirmReceiving = useCallback(
    () => new Promise((resolve, reject) => {
      confirmReceivingPromise.current = { resolve, reject };
      toggleConfirmReceiving();
    }),
    [toggleConfirmReceiving],
  );

  const onReceivePieces = useCallback(() => (
    isOrderClosed
      ? confirmReceiving().then(openReceiveList, noop)
      : openReceiveList()
  ), [isOrderClosed, confirmReceiving, openReceiveList]);

  const hasReceive = Boolean(piecesExistence?.[EXPECTED_PIECES_SEARCH_VALUE]);

  const [isExpectedPiecesLoading, setExpectedPiecesLoading] = useState(false);
  const [isReceivedPiecesLoading, setReceivedPiecesLoading] = useState(false);
  const [isUnreceivablePiecesLoading, setIsUnreceivablePiecesLoading] = useState(false);

  const {
    applyFilters: applyExpectedPiecesFilters,
    applySearch: applyExpectedPiecesSearch,
    filters: expectedPiecesFilters,
    changeSearch: changeExpectedPiecesSearch,
    searchQuery: expectedPiecesSearchQuery,
  } = useFilters(noop);
  const {
    applyFilters: applyReceivedPiecesFilters,
    applySearch: applyReceivedPiecesSearch,
    filters: receivedPiecesFilters,
    changeSearch: changeReceivedPiecesSearch,
    searchQuery: receivedPiecesSearchQuery,
  } = useFilters(noop, { [MENU_FILTERS.bound]: ['false'] });
  const {
    applyFilters: applyUnreceivablePiecesFilters,
    applySearch: applyUnreceivablePiecesSearch,
    filters: unreceivablePiecesFilters,
    changeSearch: changeUnreceivablePiecesSearch,
    searchQuery: unreceivablePiecesSearchQuery,
  } = useFilters(noop);
  const { filters: boundItemsFilters } = useFilters(noop, { [MENU_FILTERS.bound]: ['true'] });

  const expectedPiecesActions = useMemo(
    () => (
      <TitleDetailsExpectedActions
        applyFilters={applyExpectedPiecesFilters}
        filters={expectedPiecesFilters}
        hasReceive={hasReceive}
        onPieceCreate={onPieceCreate}
        openReceiveList={onReceivePieces}
        titleId={titleId}
        disabled={isPiecesLock || restrictions?.protectUpdate}
        canAddPiece={!restrictions?.protectCreate}
        toggleColumn={toggleExpectedPiecesColumn}
        visibleColumns={expectedPiecesVisibleColumns}
      />
    ),
    [
      applyExpectedPiecesFilters,
      expectedPiecesFilters,
      onPieceCreate,
      hasReceive,
      restrictions,
      onReceivePieces,
      titleId,
      isPiecesLock,
      toggleExpectedPiecesColumn,
      expectedPiecesVisibleColumns,
    ],
  );

  const hasUnreceive = Boolean(piecesExistence?.[PIECE_STATUS.received]);
  const receivedPiecesActions = useMemo(
    () => (
      <TitleDetailsReceivedActions
        applyFilters={applyReceivedPiecesFilters}
        filters={receivedPiecesFilters}
        titleId={titleId}
        disabled={isRestrictedByAcqUnit}
        hasUnreceive={hasUnreceive}
        isBindPiecesButtonVisible={isBinderyActive}
        toggleColumn={toggleReceivedPiecesColumn}
        visibleColumns={receivedPiecesVisibleColumns}
      />
    ),
    [
      applyReceivedPiecesFilters,
      receivedPiecesFilters,
      titleId,
      isRestrictedByAcqUnit,
      hasUnreceive,
      isBinderyActive,
      toggleReceivedPiecesColumn,
      receivedPiecesVisibleColumns,
    ],
  );

  const hasUnreceivable = Boolean(piecesExistence?.[PIECE_STATUS.unreceivable]);
  const renderUnreceivablePiecesActions = (renderColumnsMenu) => (
    <TitleDetailsUnreceivableActions
      applyFilters={applyUnreceivablePiecesFilters}
      filters={unreceivablePiecesFilters}
      titleId={titleId}
      disabled={isRestrictedByAcqUnit}
      hasRecords={hasUnreceivable}
      renderColumnsMenu={renderColumnsMenu}
    />
  );

  const lastMenu = (
    <PaneMenu>
      <IfPermission perm="ui-receiving.edit">
        <Button
          onClick={onEdit}
          marginBottom0
          disabled={isRestrictedByAcqUnit}
          buttonStyle="primary"
        >
          <FormattedMessage id="ui-receiving.title.details.button.edit" />
        </Button>
      </IfPermission>
    </PaneMenu>
  );

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Pane
        id="pane-title-details"
        defaultWidth="fill"
        dismissible
        paneTitle={title.title}
        paneSub={poLineNumber}
        onClose={onClose}
        lastMenu={lastMenu}
      >
        <TitleManager record={title.title} />
        <AccordionStatus ref={accordionStatusRef}>
          <Row end="xs">
            <Col xs={10}>
              {isOrderClosed && (
                <MessageBanner type="warning">
                  <FormattedMessage
                    id="ui-receiving.title.closedOrderMessage"
                    values={{ reason: order.closeReason?.reason }}
                  />
                </MessageBanner>
              )}
            </Col>

            <Col xs={2}>
              <ExpandAllButton />
            </Col>
          </Row>

          <hr className={css.divider} />
          <Title
            title={title.title}
            instanceId={title.instanceId}
          />

          <AccordionSet>
            <Accordion
              closedByDefault
              id={TITLE_ACCORDION.information}
              label={TITLE_ACCORDION_LABELS.information}
            >
              <ViewMetaData metadata={title.metadata} />
              <TitleInformation
                acqUnitIds={title.acqUnitIds}
                claimingActive={title.claimingActive}
                claimingInterval={title.claimingInterval}
                contributors={title.contributors}
                edition={title.edition}
                productIds={title.productIds}
                publishedDate={title.publishedDate}
                publisher={title.publisher}
                subscriptionFrom={title.subscriptionFrom}
                subscriptionInterval={title.subscriptionInterval}
                subscriptionTo={title.subscriptionTo}
                tenantId={targetTenantId}
              />
            </Accordion>

            <Accordion
              id={TITLE_ACCORDION.polDetails}
              label={TITLE_ACCORDION_LABELS.polDetails}
            >
              <POLDetails
                accessProvider={accessProvider}
                checkinItems={checkinItems}
                materialSupplier={materialSupplier}
                orderFormat={orderFormat}
                orderType={order.orderType}
                poLineId={poLineId}
                poLineNumber={poLineNumber}
                expectedReceiptDate={physical?.expectedReceiptDate}
                receivingNote={receivingNote}
                requester={requester}
                rush={rush}
                vendor={vendor}
              />
            </Accordion>

            {!checkinItems && !isPiecesLock && (
              <MessageBanner type="warning">
                <FormattedMessage id="ui-receiving.title.changePieceQuantityMessage" />
              </MessageBanner>
            )}

            <Accordion
              displayWhenClosed={expectedPiecesActions}
              displayWhenOpen={(
                <div className={css['accordion-actions']}>
                  {hasReceive && (
                    <FilterSearchInput
                      applyFilters={applyExpectedPiecesFilters}
                      applySearch={applyExpectedPiecesSearch}
                      changeSearch={changeExpectedPiecesSearch}
                      filters={expectedPiecesFilters}
                      isLoading={isExpectedPiecesLoading}
                      searchQuery={expectedPiecesSearchQuery}
                    />
                  )}
                  {expectedPiecesActions}
                </div>
              )}
              id={TITLE_ACCORDION.expected}
              label={TITLE_ACCORDION_LABELS.expected}
            >
              <ExpectedPiecesList
                key={piecesExistence?.key}
                filters={expectedPiecesFilters}
                onLoadingStatusChange={setExpectedPiecesLoading}
                title={title}
                selectPiece={onPieceEdit}
                visibleColumns={expectedPiecesVisibleColumns}
              />
            </Accordion>

            <Accordion
              displayWhenClosed={receivedPiecesActions}
              displayWhenOpen={(
                <div className={css['accordion-actions']}>
                  {hasUnreceive && (
                    <FilterSearchInput
                      applyFilters={applyReceivedPiecesFilters}
                      applySearch={applyReceivedPiecesSearch}
                      changeSearch={changeReceivedPiecesSearch}
                      filters={receivedPiecesFilters}
                      isLoading={isReceivedPiecesLoading}
                      searchQuery={receivedPiecesSearchQuery}
                    />
                  )}
                  {receivedPiecesActions}
                </div>
              )}
              id={TITLE_ACCORDION.received}
              label={TITLE_ACCORDION_LABELS.received}
            >
              <ReceivedPiecesList
                key={piecesExistence?.key}
                filters={receivedPiecesFilters}
                onLoadingStatusChange={setReceivedPiecesLoading}
                title={title}
                selectPiece={onPieceEdit}
                visibleColumns={receivedPiecesVisibleColumns}
              />
            </Accordion>
            {
              showRoutingList && (
                <RoutingListAccordion
                  canPrint
                  poLineId={poLineId}
                  allowedNumberOfRoutingLists={numberOfPhysicalUnits}
                  createButtonLabel={<FormattedMessage id="ui-orders.routing.list.accordion.create.button" />}
                  routingListUrl={ROUTING_LIST_ROUTE}
                  tenantId={targetTenantId}
                />
              )
            }

            <ColumnManager
              id="unreceivable-pieces-list"
              columnMapping={UNRECEIVABLE_PIECE_COLUMN_MAPPING}
            >
              {({ renderColumnsMenu, visibleColumns }) => (
                <Accordion
                  displayWhenClosed={renderUnreceivablePiecesActions(renderColumnsMenu)}
                  displayWhenOpen={(
                    <div className={css['accordion-actions']}>
                      {hasUnreceivable && (
                        <FilterSearchInput
                          applyFilters={applyUnreceivablePiecesFilters}
                          applySearch={applyUnreceivablePiecesSearch}
                          changeSearch={changeUnreceivablePiecesSearch}
                          filters={unreceivablePiecesFilters}
                          isLoading={isUnreceivablePiecesLoading}
                          searchQuery={unreceivablePiecesSearchQuery}
                        />
                      )}
                      {renderUnreceivablePiecesActions(renderColumnsMenu)}
                    </div>
                  )}
                  id={TITLE_ACCORDION.unreceivable}
                  label={TITLE_ACCORDION_LABELS[TITLE_ACCORDION.unreceivable]}
                >
                  <UnreceivablePiecesList
                    key={piecesExistence?.key}
                    filters={unreceivablePiecesFilters}
                    onLoadingStatusChange={setIsUnreceivablePiecesLoading}
                    title={title}
                    selectPiece={onPieceEdit}
                    visibleColumns={visibleColumns}
                  />
                </Accordion>
              )}
            </ColumnManager>

            <Accordion
              id={TITLE_ACCORDION.boundItems}
              label={TITLE_ACCORDION_LABELS.boundItems}
            >
              <BoundItemsList
                key={piecesExistence?.key}
                id="bound-items-list"
                filters={boundItemsFilters}
                title={title}
              />
            </Accordion>
          </AccordionSet>
        </AccordionStatus>

        {isAcknowledgeNote && (
          <ConfirmationModal
            aria-label={acknowledgeNoteModalLabel}
            confirmLabel={<FormattedMessage id="ui-receiving.piece.actions.confirm" />}
            heading={acknowledgeNoteModalLabel}
            id="acknowledge-receiving-note"
            message={receivingNote}
            onCancel={toggleAcknowledgeNote}
            onConfirm={() => {
              toggleAcknowledgeNote();
              confirmAcknowledgeNote();
            }}
            open
          />
        )}

        {/* TODO: eventually remove */}
        {/* {isAddPieceModalOpened && (
          <AddPieceModal
            close={toggleAddPieceModal}
            deletePiece={deletePiece}
            canDeletePiece={!isPiecesLock}
            initialValues={pieceValues}
            instanceId={title.instanceId}
            locations={locations}
            locationIds={locationIds}
            onCheckIn={onQuickReceive}
            onSubmit={onSave}
            poLine={poLine}
            restrictionsByAcqUnit={restrictions}
            onUnreceive={onUnreceive}
            getHoldingsItemsAndPieces={getHoldingsItemsAndPieces}
          />
        )} */}
      </Pane>
    </HasCommand>
  );
};

TitleDetails.propTypes = {
  crossTenant: PropTypes.bool,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
  piecesExistence: PropTypes.object,
  poLine: PropTypes.object.isRequired,
  title: PropTypes.object.isRequired,
  vendorsMap: PropTypes.object.isRequired,
};

export default withRouter(TitleDetails);
