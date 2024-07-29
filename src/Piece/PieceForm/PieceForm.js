import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { FormattedMessage } from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  checkScope,
  Col,
  collapseAllSections,
  expandAllSections,
  HasCommand,
  Pane,
  PaneFooter,
  Paneset,
  Row,
} from '@folio/stripes/components';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  DeleteHoldingsModal,
  handleKeyCommand,
  HOLDINGS_API,
  PIECE_FORMAT,
  PIECE_STATUS,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  getClaimingIntervalFromDate,
  getHoldingsItemsAndPieces,
} from '../../common/utils';
import {
  PIECE_ACTION_NAMES,
  PIECE_FORM_FIELD_NAMES,
  PIECE_FORM_SERVICE_FIELD_NAMES,
  PIECE_MODAL_ACCORDION,
  PIECE_MODAL_ACCORDION_LABELS,
} from '../constants';
import { DelayClaimModal } from '../DelayClaimModal';
import { DeletePieceModal } from '../DeletePieceModal';
import { ReceivingStatusChangeLog } from '../ReceivingStatusChangeLog';
import { SendClaimModal } from '../SendClaimModal';
import { ItemFields } from './ItemFields';
import { PieceFields } from './PieceFields';
import { PieceFormActionButtons } from './PieceFormActionButtons';

const PieceForm = ({
  canDeletePiece,
  createInventoryValues,
  form,
  handleSubmit,
  hasValidationErrors,
  initialValues,
  instanceId,
  onClose,
  onDelete: onDeleteProp,
  onUnreceive: onUnreceiveProp,
  locationIds,
  locations,
  paneTitle,
  pieceFormatOptions,
  poLine,
  pristine,
  restrictionsByAcqUnit,
  values: formValues,
}) => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const accordionStatusRef = useRef();

  const {
    batch,
    change,
    getState,
    mutators,
  } = form;

  const {
    enumeration,
    externalNote,
    format,
    id,
    internalNote,
    itemId,
    bindItemId,
    isBound,
    isCreateItem,
    metadata,
    receivingStatus,
  } = formValues;

  useEffect(() => {
    if (!id && format === PIECE_FORMAT.electronic) {
      batch(() => {
        change(PIECE_FORM_FIELD_NAMES.isCreateItem, false);
        change(PIECE_FORM_FIELD_NAMES.barcode, undefined);
        change(PIECE_FORM_FIELD_NAMES.callNumber, undefined);
        change(PIECE_FORM_FIELD_NAMES.accessionNumber, undefined);
      });
    }
  }, [batch, change, format, id]);

  const [isDeleteConfirmation, toggleDeleteConfirmation] = useModalToggle();
  const [isDeleteHoldingsConfirmation, toggleDeleteHoldingsConfirmation] = useModalToggle();
  const [isClaimDelayModalOpen, toggleClaimDelayModal] = useModalToggle();
  const [isClaimSendModalOpen, toggleClaimSendModal] = useModalToggle();

  const { protectCreate, protectUpdate, protectDelete } = restrictionsByAcqUnit;
  const disabled = (initialValues.isCreateAnother && pristine) || hasValidationErrors;
  const isItemFieldsDisabled = !itemId && !isCreateItem;
  const isSaveAndCreateDisabled = disabled || protectUpdate || protectCreate;
  const isSaveAndCloseDisabled = disabled || (protectUpdate && Boolean(id));
  const isEditDisabled = disabled || protectUpdate;
  const hasBoundItem = Boolean(bindItemId && isBound);
  const itemDetailsAccordionLabelId = hasBoundItem
    ? PIECE_MODAL_ACCORDION.originalItemDetails
    : PIECE_MODAL_ACCORDION.itemDetails;

  const onChangeDisplayOnHolding = useCallback(({ target: { checked } }) => {
    change(PIECE_FORM_FIELD_NAMES.displayOnHolding, checked);

    if (!checked) {
      change(PIECE_FORM_FIELD_NAMES.discoverySuppress, checked);
      change(PIECE_FORM_FIELD_NAMES.displayToPublic, checked);
    }
  }, [change]);

  // TODO: adapt for central ordering enabled (UIREC-374)
  const checkHoldingAbandonment = useCallback((holdingId) => {
    return ky.get(`${HOLDINGS_API}/${holdingId}`)
      .json()
      // TODO: fetch from related tenants in central ordering and for central tenant (UIREC-374)
      .then((holding) => getHoldingsItemsAndPieces(ky)(holding.id, { limit: 1 }))
      .then(({ pieces, items }) => {
        const willAbandoned = Boolean(
          pieces && items
          && (pieces.totalRecords === 1)
          && ((items.totalRecords === 1 && itemId) || items.totalRecords === 0),
        );

        return { willAbandoned };
      })
      .catch(() => ({ willAbandoned: false }));
  }, [itemId, ky]);

  const onSave = useCallback(async (e) => {
    const holdingId = getState().values?.holdingId;
    const initialHoldingId = getState().initialValues?.holdingId;

    const shouldCheckHoldingAbandonment = (id && initialHoldingId) && (holdingId !== initialHoldingId);

    if (shouldCheckHoldingAbandonment) {
      return checkHoldingAbandonment(initialHoldingId)
        .then(({ willAbandoned }) => (
          willAbandoned
            ? toggleDeleteHoldingsConfirmation()
            : handleSubmit(e)
        ));
    }

    return handleSubmit(e);
  }, [
    checkHoldingAbandonment,
    handleSubmit,
    getState,
    id,
    toggleDeleteHoldingsConfirmation,
  ]);

  const onDeleteHoldings = useCallback(() => {
    change(PIECE_FORM_SERVICE_FIELD_NAMES.deleteHolding, true);
    handleSubmit();
  }, [change, handleSubmit]);

  const onCreateAnotherPiece = useCallback(() => {
    change(PIECE_FORM_SERVICE_FIELD_NAMES.postSubmitAction, PIECE_ACTION_NAMES.saveAndCreate);
    onSave();
  }, [change, onSave]);

  const onQuickReceive = useCallback(() => {
    change(PIECE_FORM_SERVICE_FIELD_NAMES.postSubmitAction, PIECE_ACTION_NAMES.quickReceive);
    onSave();
  }, [change, onSave]);

  const onUnreceive = useCallback(() => {
    const currentPiece = {
      ...formValues,
      checked: true,
    };

    return onUnreceiveProp([currentPiece]);
  }, [formValues, onUnreceiveProp]);

  const onStatusChange = useCallback((status) => {
    change(PIECE_FORM_FIELD_NAMES.receivingStatus, status);
    onSave();
  }, [change, onSave]);

  const onClaimDelay = useCallback(({ claimingDate }) => {
    change(PIECE_FORM_FIELD_NAMES.claimingInterval, getClaimingIntervalFromDate(claimingDate));
    onStatusChange(PIECE_STATUS.claimDelayed);
  }, [change, onStatusChange]);

  const onClaimSend = useCallback(({ claimingDate, ...rest }) => {
    batch(() => {
      change(PIECE_FORM_FIELD_NAMES.claimingInterval, getClaimingIntervalFromDate(claimingDate));
      Object.entries(rest).forEach(([field, value]) => change(field, value));
    });
    onStatusChange(PIECE_STATUS.claimSent);
  }, [batch, change, onStatusChange]);

  const onDelete = useCallback((options) => {
    return onDeleteProp({ id, enumeration }, options);
  }, [id, enumeration, onDeleteProp]);

  const actionsDisabled = {
    [PIECE_ACTION_NAMES.quickReceive]: isEditDisabled,
    [PIECE_ACTION_NAMES.saveAndClose]: isSaveAndCloseDisabled,
    [PIECE_ACTION_NAMES.saveAndCreate]: isSaveAndCreateDisabled,
    [PIECE_ACTION_NAMES.unReceivable]: isEditDisabled,
    [PIECE_ACTION_NAMES.delete]: !canDeletePiece || protectDelete,
    [PIECE_ACTION_NAMES.expect]: isEditDisabled,
    [PIECE_ACTION_NAMES.unReceive]: isEditDisabled,
    [PIECE_ACTION_NAMES.sendClaim]: isEditDisabled,
    [PIECE_ACTION_NAMES.delayClaim]: isEditDisabled,
  };

  const start = (
    <Button
      data-test-add-piece-cancel
      marginBottom0
      onClick={onClose}
    >
      <FormattedMessage id="ui-receiving.piece.actions.cancel" />
    </Button>
  );

  const end = (
    <PieceFormActionButtons
      actionsDisabled={actionsDisabled}
      isEditMode={Boolean(id)}
      onCreateAnotherPiece={onCreateAnotherPiece}
      onClaimDelay={toggleClaimDelayModal}
      onClaimSend={toggleClaimSendModal}
      onDelete={toggleDeleteConfirmation}
      onReceive={onQuickReceive}
      onUnreceivePiece={onUnreceive}
      onSave={onSave}
      onStatusChange={onStatusChange}
      status={receivingStatus}
    />
  );

  const formFooter = (
    <PaneFooter
      renderStart={start}
      renderEnd={end}
    />
  );

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onClose),
    },
    {
      name: 'save',
      handler: handleKeyCommand(onSave, { disabled: isSaveAndCloseDisabled }),
    },
    {
      name: 'receive',
      shortcut: 'mod + alt + r',
      handler: handleKeyCommand(onQuickReceive, { disabled: isEditDisabled }),
    },
    {
      name: 'saveAndCreateAnother',
      shortcut: 'alt + s',
      handler: handleKeyCommand(onCreateAnotherPiece, {
        disabled: isSaveAndCreateDisabled || !stripes.hasPerm('ui-receiving.create'),
      }),
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

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Paneset>
        <Pane
          defaultWidth="fill"
          dismissible
          id="pane-title-form"
          onClose={onClose}
          paneTitle={paneTitle}
          footer={formFooter}
        >
          <Row>
            <Col
              xs={12}
              md={8}
              mdOffset={2}
            >
              <AccordionStatus ref={accordionStatusRef}>
                <AccordionSet>
                  {metadata && (
                    <ViewMetaData
                      id={PIECE_MODAL_ACCORDION.metadata}
                      metadata={metadata}
                    />
                  )}

                  <form>
                    <Accordion
                      id={PIECE_MODAL_ACCORDION.pieceDetails}
                      label={PIECE_MODAL_ACCORDION_LABELS[PIECE_MODAL_ACCORDION.pieceDetails]}
                    >
                      <PieceFields
                        createInventoryValues={createInventoryValues}
                        instanceId={instanceId}
                        locationIds={locationIds}
                        locations={locations}
                        pieceFormatOptions={pieceFormatOptions}
                        poLine={poLine}
                        setLocationValue={mutators.setLocationValue}
                        onChangeDisplayOnHolding={onChangeDisplayOnHolding}
                      />
                    </Accordion>

                    <Accordion
                      closedByDefault={isItemFieldsDisabled}
                      id={PIECE_MODAL_ACCORDION.itemDetails}
                      label={PIECE_MODAL_ACCORDION_LABELS[itemDetailsAccordionLabelId]}
                    >
                      <ItemFields disabled={isItemFieldsDisabled} />
                    </Accordion>
                  </form>

                  {id && (
                    <Accordion
                      closedByDefault
                      id={PIECE_MODAL_ACCORDION.statusChangeLog}
                      label={PIECE_MODAL_ACCORDION_LABELS[PIECE_MODAL_ACCORDION.statusChangeLog]}
                    >
                      <ReceivingStatusChangeLog pieceId={id} />
                    </Accordion>
                  )}
                </AccordionSet>
              </AccordionStatus>
            </Col>
          </Row>

          {
            isDeleteConfirmation && (
              <DeletePieceModal
                onCancel={toggleDeleteConfirmation}
                onConfirm={onDelete}
                piece={formValues}
              />
            )
          }

          {
            isDeleteHoldingsConfirmation && (
              <DeleteHoldingsModal
                onCancel={toggleDeleteHoldingsConfirmation}
                onKeepHoldings={handleSubmit}
                onConfirm={onDeleteHoldings}
              />
            )
          }

          <DelayClaimModal
            open={isClaimDelayModalOpen}
            onCancel={toggleClaimDelayModal}
            onSubmit={onClaimDelay}
          />

          <SendClaimModal
            open={isClaimSendModalOpen}
            onCancel={toggleClaimSendModal}
            onSubmit={onClaimSend}
            initialValues={{ internalNote, externalNote }}
          />
        </Pane>
      </Paneset>
    </HasCommand>
  );
};

PieceForm.propTypes = {
  canDeletePiece: PropTypes.bool,
  createInventoryValues: PropTypes.object.isRequired,
  form: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  hasValidationErrors: PropTypes.bool.isRequired,
  initialValues: PropTypes.object.isRequired,
  instanceId: PropTypes.string,
  locationIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUnreceive: PropTypes.func.isRequired,
  paneTitle: PropTypes.node.isRequired,
  pieceFormatOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  poLine: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  restrictionsByAcqUnit: PropTypes.shape({
    protectCreate: PropTypes.bool,
    protectDelete: PropTypes.bool,
    protectUpdate: PropTypes.bool,
  }),
  values: PropTypes.object.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: {
    hasValidationErrors: true,
    values: true,
  },
  mutators: {
    setLocationValue: (args, state, tools) => {
      const [location, locationField, holdingFieldName, holdingId] = args;
      const locationId = holdingId ? undefined : location?.id || location;

      tools.changeValue(state, locationField, () => locationId);

      if (holdingFieldName) {
        tools.changeValue(state, holdingFieldName, () => holdingId);
      }
    },
  },
})(PieceForm);
