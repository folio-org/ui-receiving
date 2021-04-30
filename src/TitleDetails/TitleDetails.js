import React, { useCallback, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  get,
  sortBy,
} from 'lodash';
import { FormattedMessage } from 'react-intl';

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
  useStripes,
} from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  ORDER_FORMATS,
  ORDER_STATUSES,
  PIECE_STATUS,
  useModalToggle,
} from '@folio/stripes-acq-components';

import TitleInformation from './TitleInformation';
import ExpectedPiecesList from './ExpectedPiecesList';
import ReceivedPiecesList from './ReceivedPiecesList';
import AddPieceModal from './AddPieceModal';
import {
  ORDER_FORMAT_TO_PIECE_FORMAT,
  TITLE_ACCORDION_LABELS,
  TITLE_ACCORDION,
} from './constants';
import {
  TitleDetailsExpectedActions,
  TitleDetailsReceivedActions,
} from './TitleDetailsActions';
import Title from './Title';
import POLDetails from './POLDetails';

function getNewPieceValues(titleId, poLine) {
  const { orderFormat, id: poLineId, receiptDate, locations } = poLine;
  const initialValuesPiece = { receiptDate, poLineId, titleId };

  if (orderFormat !== ORDER_FORMATS.PEMix) {
    initialValuesPiece.format = ORDER_FORMAT_TO_PIECE_FORMAT[orderFormat];
  }

  if (locations.length === 1) {
    initialValuesPiece.locationId = locations[0].locationId;
  }

  return initialValuesPiece;
}

const TitleDetails = ({
  deletePiece,
  history,
  location,
  locations,
  onAddPiece,
  onCheckIn,
  onClose,
  onEdit,
  order,
  pieces,
  poLine,
  title,
  vendorsMap,
}) => {
  const stripes = useStripes();
  const [isAcknowledgeNote, toggleAcknowledgeNote] = useModalToggle();
  const [isAddPieceModalOpened, toggleAddPieceModal] = useModalToggle();
  const [pieceValues, setPieceValues] = useState({});
  const [confirmAcknowledgeNote, setConfirmAcknowledgeNote] = useState();
  const [isConfirmReceiving, toggleConfirmReceiving] = useModalToggle();
  const [confirmReceiving, setConfirmReceiving] = useState();
  const [checkInPieceValues, setCheckInPieceValues] = useState();
  const accordionStatusRef = useRef();
  const receivingNote = get(poLine, 'details.receivingNote');
  const expectedPieces = pieces.filter(({ receivingStatus }) => receivingStatus === PIECE_STATUS.expected);

  const receivedPieces = sortBy(pieces.filter(
    ({ receivingStatus }) => receivingStatus === PIECE_STATUS.received,
  ), 'receivedDate');
  const { id: poLineId, receiptDate, poLineNumber, checkinItems, orderFormat } = poLine;
  const titleId = title.id;
  const isOrderClosed = order.workflowStatus === ORDER_STATUSES.closed;
  const pieceLocationId = pieceValues.locationId;
  const poLineLocations = poLine?.locations?.map(({ locationId }) => locationId) ?? [];
  const poLineLocationIds = useMemo(() => poLineLocations, [poLineLocations]);
  const locationIds = useMemo(() => (
    pieceLocationId ? [...new Set([...poLineLocationIds, pieceLocationId])] : poLineLocationIds
  ), [poLineLocationIds, pieceLocationId]);
  const vendor = vendorsMap[order.vendor];
  const accessProvider = vendorsMap[poLine?.eresource?.accessProvider];
  const materialSupplier = vendorsMap[poLine?.physical?.materialSupplier];

  const shortcuts = [
    {
      name: 'new',
      handler: () => {
        if (stripes.hasPerm('ui-receiving.create')) {
          history.push('/receiving/create');
        }
      },
    },
    {
      name: 'edit',
      handler: () => {
        if (stripes.hasPerm('ui-receiving.edit')) onEdit();
      },
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
      setPieceValues(piece || getNewPieceValues(title.id, poLine));
      setConfirmAcknowledgeNote(() => toggleAddPieceModal);

      return (
        title.isAcknowledged
          ? toggleAcknowledgeNote()
          : toggleAddPieceModal()
      );
    },
    [poLine, title.id, title.isAcknowledged, toggleAcknowledgeNote, toggleAddPieceModal],
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
        pathname: `/receiving/receive/${titleId}`,
        search: location.search,
      });
    },
    [titleId, history, location.search],
  );

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

  const onReceivePieces = useCallback(() => {
    setConfirmReceiving(() => openReceiveList);

    return isOrderClosed ? toggleConfirmReceiving() : openReceiveList();
  }, [isOrderClosed, toggleConfirmReceiving, openReceiveList]);

  const onConfirmReceiving = useCallback(() => {
    toggleConfirmReceiving();
    confirmReceiving(checkInPieceValues);
  }, [toggleConfirmReceiving, confirmReceiving, checkInPieceValues]);

  const onSave = useCallback(
    (values) => {
      onAddPiece(values);
      toggleAddPieceModal();
    },
    [onAddPiece, toggleAddPieceModal],
  );

  const onQuickReceive = useCallback(values => {
    setConfirmReceiving(() => onCheckIn);
    setCheckInPieceValues(values);

    return isOrderClosed ? toggleConfirmReceiving() : onCheckIn(values);
  }, [isOrderClosed, toggleConfirmReceiving, onCheckIn]);

  const hasReceive = Boolean(expectedPieces.length);
  const expectedPiecesActions = useMemo(
    () => (
      <TitleDetailsExpectedActions
        checkinItems={checkinItems}
        hasReceive={hasReceive}
        openAddPieceModal={openAddPieceModal}
        openReceiveList={onReceivePieces}
        titleId={titleId}
      />
    ),
    [titleId, checkinItems, openAddPieceModal, hasReceive, onReceivePieces],
  );

  const hasUnreceive = Boolean(receivedPieces.length);
  const receivedPiecesActions = useMemo(
    () => (
      <TitleDetailsReceivedActions
        titleId={titleId}
        hasUnreceive={hasUnreceive}
      />
    ),
    [titleId, hasUnreceive],
  );

  const lastMenu = (
    <PaneMenu>
      <IfPermission perm="ui-receiving.edit">
        <Button
          onClick={onEdit}
          marginBottom0
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

          <hr />
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
                contributors={title.contributors}
                edition={title.edition}
                productIds={title.productIds}
                publishedDate={title.publishedDate}
                publisher={title.publisher}
                subscriptionFrom={title.subscriptionFrom}
                subscriptionInterval={title.subscriptionInterval}
                subscriptionTo={title.subscriptionTo}
              />
            </Accordion>

            <Accordion
              id={TITLE_ACCORDION.polDetails}
              label={TITLE_ACCORDION_LABELS.polDetails}
            >
              <POLDetails
                accessProvider={accessProvider}
                materialSupplier={materialSupplier}
                orderFormat={orderFormat}
                orderType={order.orderType}
                poLineId={poLineId}
                poLineNumber={poLineNumber}
                receiptDate={receiptDate}
                receivingNote={receivingNote}
                vendor={vendor}
              />
            </Accordion>

            <Accordion
              displayWhenClosed={expectedPiecesActions}
              displayWhenOpen={expectedPiecesActions}
              id={TITLE_ACCORDION.expected}
              label={TITLE_ACCORDION_LABELS.expected}
            >
              <ExpectedPiecesList
                selectPiece={openAddPieceModal}
                pieces={expectedPieces}
              />
            </Accordion>

            <Accordion
              displayWhenClosed={receivedPiecesActions}
              displayWhenOpen={receivedPiecesActions}
              id={TITLE_ACCORDION.received}
              label={TITLE_ACCORDION_LABELS.received}
            >
              <ReceivedPiecesList
                pieces={receivedPieces}
                selectPiece={openEditReceivedPieceModal}
              />
            </Accordion>
          </AccordionSet>
        </AccordionStatus>

        {isAcknowledgeNote && (
          <ConfirmationModal
            confirmLabel={<FormattedMessage id="ui-receiving.piece.actions.confirm" />}
            heading={<FormattedMessage id="ui-receiving.piece.receivingNoteModal.title" />}
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

        {isAddPieceModalOpened && (
          <AddPieceModal
            close={toggleAddPieceModal}
            deletePiece={deletePiece}
            initialValues={pieceValues}
            instanceId={title.instanceId}
            locations={locations}
            locationIds={locationIds}
            onCheckIn={onQuickReceive}
            onSubmit={onSave}
            poLine={poLine}
          />
        )}

        {isConfirmReceiving && (
          <ConfirmationModal
            confirmLabel={<FormattedMessage id="ui-receiving.piece.actions.confirm" />}
            heading={<FormattedMessage id="ui-receiving.piece.confirmReceiving.title" />}
            id="confirm-receiving"
            message={<FormattedMessage id="ui-receiving.piece.confirmReceiving.message" />}
            onCancel={toggleConfirmReceiving}
            onConfirm={onConfirmReceiving}
            open
          />
        )}
      </Pane>
    </HasCommand>
  );
};

TitleDetails.propTypes = {
  deletePiece: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
  onAddPiece: PropTypes.func.isRequired,
  onCheckIn: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
  pieces: PropTypes.arrayOf(PropTypes.object),
  poLine: PropTypes.object.isRequired,
  title: PropTypes.object.isRequired,
  vendorsMap: PropTypes.object.isRequired,
};

TitleDetails.defaultProps = {
  pieces: [],
};

export default withRouter(TitleDetails);
