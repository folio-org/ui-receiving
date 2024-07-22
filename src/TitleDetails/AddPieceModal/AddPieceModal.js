import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  HasCommand,
  Modal,
  checkScope,
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  ModalFooter,
  PIECE_STATUS,
  handleKeyCommand,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { HOLDINGS_API } from '../../common/constants';
import { getClaimingIntervalFromDate } from '../../common/utils';
import {
  PIECE_ACTION_NAMES,
  PIECE_FORM_FIELD_NAMES,
  PIECE_MODAL_ACCORDION,
  PIECE_MODAL_ACCORDION_LABELS,
} from '../constants';
import { DelayClaimModal } from '../DelayClaimModal';
import { DeletePieceModal } from '../DeletePieceModal';
import { DeleteHoldingsModal } from '../DeleteHoldingsModal';
import { SendClaimModal } from '../SendClaimModal';
import { ItemFields } from './ItemFields';
import { ModalActionButtons } from './ModalActionButtons';
import { PieceFields } from './PieceFields';
import { ReceivingStatusChangeLog } from './ReceivingStatusChangeLog';

const AddPieceModal = ({
  canDeletePiece,
  close,
  createInventoryValues,
  deletePiece,
  form,
  getHoldingsItemsAndPieces,
  handleSubmit,
  hasValidationErrors,
  initialValues,
  instanceId,
  restrictionsByAcqUnit,
  locationIds,
  locations,
  onCheckIn,
  onUnreceive,
  pieceFormatOptions,
  poLine,
  pristine,
  values: formValues,
}) => {
  const {
    batch,
    change,
    getState,
    mutators,
  } = form;
  const {
    enumeration,
    externalNote,
    id,
    internalNote,
    itemId,
    isCreateAnother,
    isCreateItem,
    metadata,
    receivingStatus,
  } = formValues;

  /*
    When the "saveAndCreate" action is triggered, `isCreateAnother` is passed as an initial value to apply validations.
    This param should be reset to `false` after the component init.
  */
  useEffect(() => {
    change(PIECE_FORM_FIELD_NAMES.isCreateAnother, false);
  }, [change]);

  const labelId = id ? 'ui-receiving.piece.addPieceModal.editTitle' : 'ui-receiving.piece.addPieceModal.title';

  const [isDeleteConfirmation, toggleDeleteConfirmation] = useModalToggle();
  const [isDeleteHoldingsConfirmation, toggleDeleteHoldingsConfirmation] = useModalToggle();
  const [isClaimDelayModalOpen, toggleClaimDelayModal] = useModalToggle();
  const [isClaimSendModalOpen, toggleClaimSendModal] = useModalToggle();

  const stripes = useStripes();
  const ky = useOkapiKy();
  const intl = useIntl();
  const accordionStatusRef = useRef();
  const modalLabel = intl.formatMessage({ id: labelId });

  const initialHoldingId = useMemo(() => getState().initialValues?.holdingId, [getState]);

  const { protectCreate, protectUpdate, protectDelete } = restrictionsByAcqUnit;
  const disabled = (initialValues.isCreateAnother && pristine) || hasValidationErrors;
  const isItemFieldsDisabled = !itemId && !isCreateItem;
  const isSaveAndCreateDisabled = disabled || protectUpdate || protectCreate;
  const isSaveAndCloseDisabled = disabled || (protectUpdate && Boolean(id));
  const isEditDisabled = disabled || protectUpdate;

  const onReceive = useCallback(
    () => {
      onCheckIn(formValues);
      close();
    },
    [close, formValues, onCheckIn],
  );

  const onDelete = useCallback((options) => {
    close();
    deletePiece({ id, enumeration }, options);
  }, [enumeration, close, deletePiece, id]);

  const onChangeDisplayOnHolding = ({ target: { checked } }) => {
    change(PIECE_FORM_FIELD_NAMES.displayOnHolding, checked);

    if (!checked) {
      change(PIECE_FORM_FIELD_NAMES.discoverySuppress, checked);
      change(PIECE_FORM_FIELD_NAMES.displayToPublic, checked);
    }
  };

  // TODO: create adapter for central ordering enabled
  const checkHoldingAbandonment = useCallback((holdingId) => {
    return ky.get(`${HOLDINGS_API}/${holdingId}`)
      .json()
      .then((holding) => getHoldingsItemsAndPieces(holding.id, { limit: 1 }))
      .then(({ pieces, items }) => {
        const willAbandoned = Boolean(
          pieces && items
          && (pieces.totalRecords === 1)
          && ((items.totalRecords === 1 && itemId) || items.totalRecords === 0),
        );

        return { willAbandoned };
      })
      .catch(() => ({ willAbandoned: false }));
  }, [getHoldingsItemsAndPieces, itemId, ky]);

  const onSave = useCallback(async (e) => {
    const holdingId = getState().values?.holdingId;
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
  }, [checkHoldingAbandonment, getState, handleSubmit, id, initialHoldingId, toggleDeleteHoldingsConfirmation]);

  const onCreateAnotherPiece = useCallback((e) => {
    change(PIECE_FORM_FIELD_NAMES.isCreateAnother, true);
    onSave(e);
  }, [change, onSave]);

  const onDeleteHoldings = useCallback(() => {
    change(PIECE_FORM_FIELD_NAMES.deleteHolding, true);
    handleSubmit();
  }, [change, handleSubmit]);

  const onStatusChange = useCallback((status) => {
    change(PIECE_FORM_FIELD_NAMES.receivingStatus, status);
    onSave();
  }, [change, onSave]);

  const onUnreceivePiece = useCallback(async () => {
    const currentPiece = {
      ...formValues,
      checked: true,
    };

    await onUnreceive([currentPiece]);
    close();
  },
  [close, onUnreceive, formValues]);

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
      onClick={close}
    >
      <FormattedMessage id="ui-receiving.piece.actions.cancel" />
    </Button>
  );
  const end = (
    <ModalActionButtons
      actionsDisabled={actionsDisabled}
      isCreateAnother={isCreateAnother}
      isEditMode={Boolean(id)}
      onCreateAnotherPiece={onCreateAnotherPiece}
      onClaimDelay={toggleClaimDelayModal}
      onClaimSend={toggleClaimSendModal}
      onDelete={toggleDeleteConfirmation}
      onReceive={onReceive}
      onUnreceivePiece={onUnreceivePiece}
      onSave={onSave}
      onStatusChange={onStatusChange}
      status={receivingStatus}
    />
  );

  const footer = (
    <ModalFooter
      renderStart={start}
      renderEnd={end}
    />
  );

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(close),
    },
    {
      name: 'save',
      handler: handleKeyCommand(onSave, { disabled: isSaveAndCloseDisabled }),
    },
    {
      name: 'receive',
      shortcut: 'mod + alt + r',
      handler: handleKeyCommand(onReceive, { disabled: isEditDisabled }),
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
    <Modal
      enforceFocus={false}
      footer={footer}
      id="add-piece-modal"
      size="large"
      label={modalLabel}
      aria-label={modalLabel}
      open
    >
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
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
                label={PIECE_MODAL_ACCORDION_LABELS[PIECE_MODAL_ACCORDION.itemDetails]}
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
                <ReceivingStatusChangeLog piece={formValues} />
              </Accordion>
            )}
          </AccordionSet>
        </AccordionStatus>
      </HasCommand>

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
    </Modal>
  );
};

AddPieceModal.propTypes = {
  close: PropTypes.func.isRequired,
  createInventoryValues: PropTypes.object.isRequired,
  deletePiece: PropTypes.func.isRequired,
  canDeletePiece: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  onUnreceive: PropTypes.func.isRequired,
  form: PropTypes.object,
  values: PropTypes.object.isRequired,
  instanceId: PropTypes.string,
  onCheckIn: PropTypes.func.isRequired,
  pieceFormatOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  hasValidationErrors: PropTypes.bool.isRequired,
  locationIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
  poLine: PropTypes.object.isRequired,
  getHoldingsItemsAndPieces: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  restrictionsByAcqUnit: PropTypes.shape({
    protectCreate: PropTypes.bool,
    protectDelete: PropTypes.bool,
    protectUpdate: PropTypes.bool,
  }),
};

AddPieceModal.defaultProps = {
  pieceFormatOptions: [],
  restrictionsByAcqUnit: {},
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { hasValidationErrors: true, values: true },
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
})(AddPieceModal);
