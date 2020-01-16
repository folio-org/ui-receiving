import React, { useCallback } from 'react';
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
  ORDER_FORMATS,
  useAccordionToggle,
  useModalToggle,
} from '@folio/stripes-acq-components';

import TitleInformation from './TitleInformation';
import ExpectedPiecesList from './ExpectedPiecesList';
import ReceivedPiecesList from './ReceivedPiecesList';
import AddPieceModal from './AddPieceModal';
import {
  ORDER_FORMAT_TO_PIECE_FORMAT,
  PIECE_FORMAT_OPTIONS,
  PIECE_STATUS,
  TITLE_ACCORDION_LABELS,
  TITLE_ACCORDION,
} from './constants';
import { getPOLLocationsForSelect } from './utils';

const TitleDetails = ({
  locations,
  onAddPiece,
  onCheckIn,
  onClose,
  onEdit,
  pieces,
  poLine,
  title,
}) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle();
  const [isAcknowledgeNote, toggleAcknowledgeNote] = useModalToggle();
  const [isAddPieceModalOpened, toggleAddPieceModalOpened] = useModalToggle();
  const receivingNote = get(poLine, 'details.receivingNote');
  const expectedPieces = pieces.filter(({ receivingStatus }) => receivingStatus === PIECE_STATUS.expected);
  const receivedPieces = sortBy(pieces.filter(
    ({ receivingStatus }) => receivingStatus === PIECE_STATUS.received,
  ), 'receivedDate');
  const { orderFormat, id: poLineId, receiptDate, poLineNumber, locations: poLineLocations } = poLine;
  const initialValuesPiece = { receiptDate, poLineId };

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
          : toggleAddPieceModalOpened()
      );
    },
    [title.isAcknowledged, toggleAcknowledgeNote, toggleAddPieceModalOpened],
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
      toggleAddPieceModalOpened();
    },
    [onAddPiece, toggleAddPieceModalOpened],
  );

  const newPieceButton = (
    <Button
      data-test-add-piece-button
      onClick={openModal}
    >
      <FormattedMessage id="ui-receiving.piece.button.addPiece" />
    </Button>
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
            publicationDate={title.publicationDate}
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
          id={TITLE_ACCORDION.expected}
          label={TITLE_ACCORDION_LABELS.expected}
          displayWhenOpen={newPieceButton}
        >
          <ExpectedPiecesList
            pieces={expectedPieces}
            title={title.title}
          />
        </Accordion>

        <Accordion
          id={TITLE_ACCORDION.received}
          label={TITLE_ACCORDION_LABELS.received}
        >
          <ReceivedPiecesList
            pieces={receivedPieces}
            title={title.title}
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
            toggleAddPieceModalOpened();
          }}
          open
        />
      )}

      {isAddPieceModalOpened && (
        <AddPieceModal
          close={toggleAddPieceModalOpened}
          createInventoryValues={getCreateInventoryValues()}
          initialValues={initialValuesPiece}
          instanceId={title.instanceId}
          locations={getPOLLocationsForSelect(locations, poLineLocations)}
          onCheckIn={onCheckIn}
          onSubmit={onSave}
          pieceFormatOptions={pieceFormatOptions}
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
  pieces: PropTypes.arrayOf(PropTypes.object),
  poLine: PropTypes.object.isRequired,
  title: PropTypes.object.isRequired,
};

TitleDetails.defaultProps = {
  locations: [],
  pieces: [],
};

export default TitleDetails;
