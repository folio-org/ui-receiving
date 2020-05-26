import React, { useCallback, useMemo, useState } from 'react';
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
  PIECE_STATUS,
  useAccordionToggle,
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
  const { orderFormat, id: poLineId, receiptDate } = poLine;
  const initialValuesPiece = { receiptDate, poLineId, titleId };

  if (orderFormat !== ORDER_FORMATS.PEMix) {
    initialValuesPiece.format = ORDER_FORMAT_TO_PIECE_FORMAT[orderFormat];
  }

  return initialValuesPiece;
}

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
  const [confirmAcknowledgeNote, setConfirmAcknowledgeNote] = useState();
  const receivingNote = get(poLine, 'details.receivingNote');
  const expectedPieces = pieces.filter(({ receivingStatus }) => receivingStatus === PIECE_STATUS.expected);

  const receivedPieces = sortBy(pieces.filter(
    ({ receivingStatus }) => receivingStatus === PIECE_STATUS.received,
  ), 'receivedDate');
  const { id: poLineId, receiptDate, poLineNumber, checkinItems } = poLine;
  const titleId = title.id;
  const isOrderClosed = order.workflowStatus === ORDER_STATUSES.closed;

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
        hasReceive={hasReceive}
        openAddPieceModal={openAddPieceModal}
        openReceiveList={openReceiveList}
        titleId={titleId}
      />
    ),
    [titleId, checkinItems, openAddPieceModal, hasReceive, openReceiveList],
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
            confirmAcknowledgeNote();
          }}
          open
        />
      )}

      {isAddPieceModalOpened && (
        <AddPieceModal
          close={toggleAddPieceModal}
          initialValues={pieceValues}
          instanceId={title.instanceId}
          onCheckIn={onCheckIn}
          onSubmit={onSave}
          poLine={poLine}
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

export default withRouter(TitleDetails);
