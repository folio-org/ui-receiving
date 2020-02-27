import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
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
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  getLocationOptions,
  ORDER_FORMATS,
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
  ORDER_FORMAT_TO_PIECE_FORMAT,
  TITLE_ACCORDION_LABELS,
  TITLE_ACCORDION,
} from './constants';

const TitleDetails = ({
  locations,
  onAddPiece,
  onCheckIn,
  onClose,
  onEdit,
  onUnreceivePiece,
  pieces,
  poLine,
  title,
}) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle();
  const [isAcknowledgeNote, toggleAcknowledgeNote] = useModalToggle();
  const [isAddPieceModalOpened, toggleAddPieceModal] = useModalToggle();
  const [isUnreceiveConfirmation, toggleUnreceiveConfirmation] = useModalToggle();
  const [pieceValues, setPieceValues] = useState({});
  const [pieceToUnreceive, setPieceToUnreceive] = useState();
  const receivingNote = get(poLine, 'details.receivingNote');
  const expectedPieces = pieces.filter(({ receivingStatus }) => receivingStatus === PIECE_STATUS.expected);

  const receivedPieces = sortBy(pieces.filter(
    ({ receivingStatus }) => receivingStatus === PIECE_STATUS.received,
  ), 'receivedDate');
  const { orderFormat, id: poLineId, receiptDate, poLineNumber, checkinItems } = poLine;
  const initialValuesPiece = { receiptDate, poLineId, ...pieceValues };

  let pieceFormatOptions = PIECE_FORMAT_OPTIONS;

  if (orderFormat !== ORDER_FORMATS.PEMix) {
    initialValuesPiece.format = ORDER_FORMAT_TO_PIECE_FORMAT[orderFormat];
    pieceFormatOptions = PIECE_FORMAT_OPTIONS.filter(({ value }) => value === initialValuesPiece.format);
  }

  const openModal = useCallback(
    () => {
      return (
        title.isAcknowledged
          ? toggleAcknowledgeNote()
          : toggleAddPieceModal()
      );
    },
    [title.isAcknowledged, toggleAcknowledgeNote, toggleAddPieceModal],
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

  const expectedPiecesActions = useMemo(
    () => (
      <>
        <Button
          data-test-title-receive-button
          to={`/receiving/receive/${title.id}`}
        >
          <FormattedMessage id="ui-receiving.title.details.button.receive" />
        </Button>
        {checkinItems && (
          <Button
            data-test-add-piece-button
            onClick={openModal}
          >
            <FormattedMessage id="ui-receiving.piece.button.addPiece" />
          </Button>
        )}
      </>
    ),
    [title.id, checkinItems, openModal],
  );

  const confirmUnreceivePiece = useCallback(
    () => {
      onUnreceivePiece(pieceToUnreceive);
      toggleUnreceiveConfirmation();
    },
    [pieceToUnreceive, onUnreceivePiece, toggleUnreceiveConfirmation],
  );

  const mountUnreceivePieceConfirmation = useCallback(
    (piece) => {
      setPieceToUnreceive(piece);
      toggleUnreceiveConfirmation();
    },
    [toggleUnreceiveConfirmation, setPieceToUnreceive],
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
      paneSub={poLine.poLineNumber}
      onClose={onClose}
      lastMenu={lastMenu}
    >
      <Row end="xs">
        <Col xs={12}>
          <ExpandAllButton
            accordionStatus={sections}
            onToggle={expandAll}
          />
        </Col>
      </Row>

      <AccordionSet
        accordionStatus={sections}
        onToggle={toggleSection}
      >
        <Accordion
          id={TITLE_ACCORDION.information}
          label={TITLE_ACCORDION_LABELS.information}
        >
          <ViewMetaData metadata={title.metadata} />
          <TitleInformation
            contributors={title.contributors}
            edition={title.edition}
            instanceId={title.instanceId}
            poLineNumber={poLineNumber}
            productIds={title.productIds}
            publishedDate={title.publishedDate}
            publisher={title.publisher}
            receiptDate={receiptDate}
            receivingNote={receivingNote}
            subscriptionFrom={title.subscriptionFrom}
            subscriptionInterval={title.subscriptionInterval}
            subscriptionTo={title.subscriptionTo}
            title={title.title}
          />
        </Accordion>

        <Accordion
          displayWhenClosed={expectedPiecesActions}
          displayWhenOpen={expectedPiecesActions}
          id={TITLE_ACCORDION.expected}
          label={TITLE_ACCORDION_LABELS.expected}
        >
          <ExpectedPiecesList
            onEditPiece={onEditPiece}
            pieces={expectedPieces}
          />
        </Accordion>

        <Accordion
          id={TITLE_ACCORDION.received}
          label={TITLE_ACCORDION_LABELS.received}
        >
          <ReceivedPiecesList
            onUnreceivePiece={mountUnreceivePieceConfirmation}
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
            toggleAddPieceModal();
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
          locations={getLocationOptions(locations)}
          onCheckIn={onCheckIn}
          onSubmit={onSave}
          pieceFormatOptions={pieceFormatOptions}
        />
      )}

      {isUnreceiveConfirmation && (
        <ConfirmationModal
          confirmLabel={<FormattedMessage id="ui-receiving.piece.actions.unreceive.confirm" />}
          heading={<FormattedMessage id="ui-receiving.piece.actions.unreceive.heading" />}
          id="unreceive-piece-confirmation"
          message={<FormattedMessage id="ui-receiving.piece.actions.unreceive.message" />}
          onCancel={toggleUnreceiveConfirmation}
          onConfirm={confirmUnreceivePiece}
          open
        />
      )}
    </Pane>
  );
};

TitleDetails.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.object),
  onAddPiece: PropTypes.func.isRequired,
  onCheckIn: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onUnreceivePiece: PropTypes.func.isRequired,
  pieces: PropTypes.arrayOf(PropTypes.object),
  poLine: PropTypes.object.isRequired,
  title: PropTypes.object.isRequired,
};

TitleDetails.defaultProps = {
  locations: [],
  pieces: [],
};

export default TitleDetails;
