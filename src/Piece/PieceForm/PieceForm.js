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
import { useStripes } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  DelayClaimsModal,
  DeleteHoldingsModal,
  getClaimingIntervalFromDate,
  handleKeyCommand,
  PIECE_FORMAT,
  PIECE_STATUS,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { setLocationValueFormMutator } from '../../common/utils';
import {
  PIECE_ACTION_NAMES,
  PIECE_FORM_FIELD_NAMES,
  PIECE_FORM_SERVICE_FIELD_NAMES,
  PIECE_MODAL_ACCORDION,
  PIECE_MODAL_ACCORDION_LABELS,
} from '../constants';
import { DeletePieceModal } from '../DeletePieceModal';
import { ReceivingStatusChangeLog } from '../ReceivingStatusChangeLog';
import { ItemFields } from './ItemFields';
import { PieceFields } from './PieceFields';
import { PieceFormActionButtons } from './PieceFormActionButtons';

const PieceForm = ({
  canDeletePiece,
  checkHoldingAbandonment,
  createInventoryValues,
  form,
  handleSubmit,
  hasValidationErrors,
  initialValues,
  instanceId,
  onClaimSend: onClaimSendProp,
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
  const accordionStatusRef = useRef();

  const {
    batch,
    change,
    getState,
    mutators,
  } = form;

  const {
    enumeration,
    format,
    id,
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

  const { protectCreate, protectUpdate, protectDelete } = restrictionsByAcqUnit;
  const isEditMode = Boolean(id);
  const disabled = (initialValues.isCreateAnother && pristine) || hasValidationErrors;
  const isItemFieldsDisabled = !itemId && !isCreateItem;
  const isSaveAndCreateDisabled = disabled || protectUpdate || protectCreate;
  const isSaveAndCloseDisabled = disabled || (protectUpdate && isEditMode);
  const isEditDisabled = disabled || protectUpdate;
  const isOriginalItemDetailsVisible = Boolean(itemId && bindItemId && isBound);
  const itemDetailsAccordionLabelId = isOriginalItemDetailsVisible
    ? PIECE_MODAL_ACCORDION.originalItemDetails
    : PIECE_MODAL_ACCORDION.itemDetails;

  const onDeleteHoldingsModalCancel = useCallback(() => {
    change(PIECE_FORM_SERVICE_FIELD_NAMES.postSubmitAction, null);
    toggleDeleteHoldingsConfirmation();
  }, [change, toggleDeleteHoldingsConfirmation]);

  const onChangeDisplayOnHolding = useCallback(({ target: { checked } }) => {
    change(PIECE_FORM_FIELD_NAMES.displayOnHolding, checked);

    if (!checked) {
      change(PIECE_FORM_FIELD_NAMES.discoverySuppress, checked);
      change(PIECE_FORM_FIELD_NAMES.displayToPublic, checked);
    }
  }, [change]);

  const onSave = useCallback(async (e) => {
    const currentHoldingId = getState().values?.holdingId;
    const initialHoldingId = getState().initialValues?.holdingId;

    const shouldCheckHoldingAbandonment = (id && initialHoldingId) && (currentHoldingId !== initialHoldingId);

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
    change(PIECE_FORM_SERVICE_FIELD_NAMES.nextReceivingStatus, status);
    onSave();
  }, [change, onSave]);

  const onClaimDelay = useCallback(({ claimingDate }) => {
    change(PIECE_FORM_FIELD_NAMES.claimingInterval, getClaimingIntervalFromDate(claimingDate));
    onStatusChange(PIECE_STATUS.claimDelayed);
  }, [change, onStatusChange]);

  const onClaimSend = useCallback(async () => {
    const updatedFields = await onClaimSendProp(formValues);

    batch(() => {
      change(PIECE_FORM_SERVICE_FIELD_NAMES.postSubmitAction, PIECE_ACTION_NAMES.sendClaim);
      Object.entries(updatedFields).forEach(([field, value]) => change(field, value));
    });
    onSave();
  }, [batch, change, formValues, onClaimSendProp, onSave]);

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
    [PIECE_ACTION_NAMES.markLate]: isEditDisabled,
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
      isEditMode={isEditMode}
      onCreateAnotherPiece={onCreateAnotherPiece}
      onClaimDelay={toggleClaimDelayModal}
      onClaimSend={onClaimSend}
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
                  {Boolean(isEditMode && metadata) && (
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
                        pieceFormatOptions={pieceFormatOptions}
                        poLine={poLine}
                        locationIds={locationIds}
                        locations={locations}
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
                onCancel={onDeleteHoldingsModalCancel}
                onKeepHoldings={handleSubmit}
                onConfirm={onDeleteHoldings}
              />
            )
          }

          <DelayClaimsModal
            open={isClaimDelayModalOpen}
            onCancel={toggleClaimDelayModal}
            onSubmit={onClaimDelay}
          />
        </Pane>
      </Paneset>
    </HasCommand>
  );
};

PieceForm.propTypes = {
  canDeletePiece: PropTypes.bool,
  checkHoldingAbandonment: PropTypes.func.isRequired,
  createInventoryValues: PropTypes.object.isRequired,
  form: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  hasValidationErrors: PropTypes.bool.isRequired,
  initialValues: PropTypes.object.isRequired,
  instanceId: PropTypes.string,
  locationIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
  onClaimSend: PropTypes.func.isRequired,
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
    errors: true,
  },
  mutators: {
    setLocationValue: setLocationValueFormMutator,
  },
})(PieceForm);
