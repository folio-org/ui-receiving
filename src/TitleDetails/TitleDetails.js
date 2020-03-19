import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  get,
  sortBy,
} from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  MessageBanner,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  ORDER_FORMATS,
  ORDER_STATUSES,
  useAccordionToggle,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  PIECE_FORMAT_OPTIONS,
  PIECE_STATUS,
} from '../common/constants';
import TitleInformation from './TitleInformation';
import ExpectedPiecesList from './ExpectedPiecesList';
import ReceivedPiecesList from './ReceivedPiecesList';
import AddPieceModal from './AddPieceModal';
import {
  EXPECTED_PIECES_BUTTONS,
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

const TitleDetails = ({
  history,
  location,
  onAddPiece,
  onCheckIn,
  onClose,
  onEdit,
  order,
  pieces,
  poLine,
  title,
}) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle();
  const [isAcknowledgeNote, toggleAcknowledgeNote] = useModalToggle();
  const [isAddPieceModalOpened, toggleAddPieceModal] = useModalToggle();
  const [pieceValues, setPieceValues] = useState({});
  const [clickedButton, setClickedButton] = useState('');
  const receivingNote = get(poLine, 'details.receivingNote');
  const expectedPieces = pieces.filter(({ receivingStatus }) => receivingStatus === PIECE_STATUS.expected);

  const receivedPieces = sortBy(pieces.filter(
    ({ receivingStatus }) => receivingStatus === PIECE_STATUS.received,
  ), 'receivedDate');
  const { orderFormat, id: poLineId, receiptDate, poLineNumber, checkinItems } = poLine;
  const initialValuesPiece = { receiptDate, poLineId, ...pieceValues };
  const isOrderClosed = order.workflowStatus === ORDER_STATUSES.closed;

  let pieceFormatOptions = PIECE_FORMAT_OPTIONS;

  if (orderFormat !== ORDER_FORMATS.PEMix) {
    initialValuesPiece.format = ORDER_FORMAT_TO_PIECE_FORMAT[orderFormat];
    pieceFormatOptions = PIECE_FORMAT_OPTIONS.filter(({ value }) => value === initialValuesPiece.format);
  }

  const openModal = useCallback(
    () => {
      setClickedButton(EXPECTED_PIECES_BUTTONS.addPiece);

      return (
        title.isAcknowledged
          ? toggleAcknowledgeNote()
          : toggleAddPieceModal()
      );
    },
    [title.isAcknowledged, toggleAcknowledgeNote, toggleAddPieceModal],
  );

  const goToReceiveList = useCallback(
    () => {
      setClickedButton(EXPECTED_PIECES_BUTTONS.receivePiece);

      return (
        title.isAcknowledged
          ? toggleAcknowledgeNote()
          : history.push({
            pathname: `/receiving/receive/${title.id}`,
            search: location.search,
          })
      );
    },
    [title.isAcknowledged, title.id, toggleAcknowledgeNote, history, location.search],
  );

  const getCreateInventoryValues = useCallback(
    () => ({
      'Physical': get(poLine, 'physical.createInventory'),
      'Electronic': get(poLine, 'eresource.createInventory'),
    }),
    [poLine],
  );

  const onSave = useCallback(
    (values) => {
      onAddPiece(values);
      toggleAddPieceModal();
    },
    [onAddPiece, toggleAddPieceModal],
  );

  const hasReceive = Boolean(expectedPieces.length);
  const expectedPiecesActions = useMemo(
    () => (
      <TitleDetailsExpectedActions
        checkinItems={checkinItems}
        goToReceiveList={goToReceiveList}
        hasReceive={hasReceive}
        openModal={openModal}
        titleId={title.id}
      />
    ),
    [title.id, checkinItems, openModal, hasReceive, goToReceiveList],
  );

  const hasUnreceive = Boolean(receivedPieces.length);
  const receivedPiecesActions = useMemo(
    () => (
      <TitleDetailsReceivedActions
        titleId={title.id}
        hasUnreceive={hasUnreceive}
      />
    ),
    [title.id, hasUnreceive],
  );

  const onEditPiece = useCallback(
    (piece) => {
      setPieceValues(piece);
      openModal();
    },
    [openModal, setPieceValues],
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
    <Pane
      id="pane-title-details"
      defaultWidth="fill"
      dismissible
      paneTitle={title.title}
      paneSub={poLineNumber}
      onClose={onClose}
      lastMenu={lastMenu}
    >
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
          <ExpandAllButton
            accordionStatus={sections}
            onToggle={expandAll}
          />
        </Col>
      </Row>

      <hr />
      <Title
        title={title.title}
        instanceId={title.instanceId}
      />

      <AccordionSet
        accordionStatus={sections}
        onToggle={toggleSection}
      >
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
            poLineId={poLineId}
            poLineNumber={poLineNumber}
            receiptDate={receiptDate}
            receivingNote={receivingNote}
          />
        </Accordion>

        <Accordion
          displayWhenClosed={expectedPiecesActions}
          displayWhenOpen={expectedPiecesActions}
          id={TITLE_ACCORDION.expected}
          label={TITLE_ACCORDION_LABELS.expected}
        >
          <ExpectedPiecesList
            selectPiece={onEditPiece}
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
          />
        </Accordion>
      </AccordionSet>

      {isAcknowledgeNote && (
        <ConfirmationModal
          confirmLabel={<FormattedMessage id="ui-receiving.piece.actions.confirm" />}
          heading={<FormattedMessage id="ui-receiving.piece.receivingNoteModal.title" />}
          id="acknowledge-receiving-note"
          message={receivingNote}
          onCancel={toggleAcknowledgeNote}
          onConfirm={() => {
            toggleAcknowledgeNote();

            if (clickedButton === EXPECTED_PIECES_BUTTONS.addPiece) {
              toggleAddPieceModal();
            } else {
              history.push({
                pathname: `/receiving/receive/${title.id}`,
                search: location.search,
              });
            }
          }}
          open
        />
      )}

      {isAddPieceModalOpened && (
        <AddPieceModal
          close={toggleAddPieceModal}
          createInventoryValues={getCreateInventoryValues()}
          initialValues={initialValuesPiece}
          instanceId={title.instanceId}
          onCheckIn={onCheckIn}
          onSubmit={onSave}
          pieceFormatOptions={pieceFormatOptions}
        />
      )}
    </Pane>
  );
};

TitleDetails.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  onAddPiece: PropTypes.func.isRequired,
  onCheckIn: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
  pieces: PropTypes.arrayOf(PropTypes.object),
  poLine: PropTypes.object.isRequired,
  title: PropTypes.object.isRequired,
};

TitleDetails.defaultProps = {
  pieces: [],
};

export default TitleDetails;
