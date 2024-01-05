import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Checkbox,
  Col,
  HasCommand,
  Modal,
  Row,
  TextArea,
  TextField,
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
  FieldDatepickerFinal,
  FieldInventory,
  FieldSelectFinal,
  INVENTORY_RECORDS_TYPE,
  ModalFooter,
  PIECE_STATUS,
  handleKeyCommand,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  CreateItemField,
  LineLocationsView,
} from '../../common/components';
import { HOLDINGS_API } from '../../common/constants';
import { getClaimingIntervalFromDate } from '../../common/utils';
import {
  PIECE_MODAL_ACCORDION,
  PIECE_MODAL_ACCORDION_LABELS,
} from '../constants';
import { DelayClaimModal } from '../DelayClaimModal';
import { DeletePieceModal } from '../DeletePieceModal';
import { DeleteHoldingsModal } from '../DeleteHoldingsModal';
import { SendClaimModal } from '../SendClaimModal';
import { ModalActionButtons } from './ModalActionButtons';
import { PIECE_ACTION_NAMES } from './ModalActionButtons/constants';
import { ReceivingStatusChangeLog } from './ReceivingStatusChangeLog';

const AddPieceModal = ({
  close,
  createInventoryValues,
  deletePiece,
  canDeletePiece,
  form,
  initialValues,
  handleSubmit,
  hasValidationErrors,
  pristine,
  instanceId,
  locationIds,
  locations,
  onCheckIn,
  pieceFormatOptions,
  values: formValues,
  poLine,
  getHoldingsItemsAndPieces,
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
    format,
    id,
    internalNote,
    itemId,
    isCreateAnother,
    metadata,
    receivingStatus,
  } = formValues;

  /*
    When the "saveAndCreate" action is triggered, `isCreateAnother` is passed as an initial value to apply validations.
    This param should be reset to `false` after the component init.
  */
  useEffect(() => {
    change('isCreateAnother', false);
  }, [change]);

  const isLocationRequired = includes(createInventoryValues[format], INVENTORY_RECORDS_TYPE.instanceAndHolding);
  const isNotReceived = receivingStatus !== PIECE_STATUS.received;
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

  const disabled = (initialValues.isCreateAnother && pristine) || hasValidationErrors;

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
    change('displayOnHolding', checked);

    if (!checked) change('discoverySuppress', checked);
  };

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
    change('isCreateAnother', true);
    onSave(e);
  }, [change, onSave]);

  const onDeleteHoldings = useCallback(() => {
    change('deleteHolding', true);
    handleSubmit();
  }, [change, handleSubmit]);

  const onStatusChange = useCallback((status) => {
    change('receivingStatus', status);
    onSave();
  }, [change, onSave]);

  const onClaimDelay = useCallback(({ claimingDate }) => {
    change('claimingInterval', getClaimingIntervalFromDate(claimingDate));
    onStatusChange(PIECE_STATUS.claimDelayed);
  }, [change, onStatusChange]);

  const onClaimSend = useCallback(({ claimingDate, ...rest }) => {
    batch(() => {
      change('claimingInterval', getClaimingIntervalFromDate(claimingDate));
      Object.entries(rest).forEach(([field, value]) => change(field, value));
    });
    onStatusChange(PIECE_STATUS.claimSent);
  }, [batch, change, onStatusChange]);

  const actionsDisabled = {
    [PIECE_ACTION_NAMES.quickReceive]: disabled,
    [PIECE_ACTION_NAMES.saveAndClose]: disabled,
    [PIECE_ACTION_NAMES.saveAndCreate]: disabled,
    [PIECE_ACTION_NAMES.unReceivable]: disabled,
    [PIECE_ACTION_NAMES.delete]: !canDeletePiece,
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
      handler: handleKeyCommand(onSave, { disabled }),
    },
    {
      name: 'receive',
      shortcut: 'mod + alt + r',
      handler: handleKeyCommand(onReceive, { disabled }),
    },
    {
      name: 'saveAndCreateAnother',
      shortcut: 'alt + s',
      handler: handleKeyCommand(onCreateAnotherPiece, {
        disabled: disabled || !stripes.hasPerm('ui-receiving.create'),
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
                <Row>
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      fullWidth
                      id="caption"
                      label={<FormattedMessage id="ui-receiving.piece.caption" />}
                      name="caption"
                      type="text"
                    />
                  </Col>
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      fullWidth
                      id="copyNumber"
                      label={<FormattedMessage id="ui-receiving.piece.copyNumber" />}
                      name="copyNumber"
                      type="text"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      fullWidth
                      id="enumeration"
                      label={<FormattedMessage id="ui-receiving.piece.enumeration" />}
                      name="enumeration"
                      type="text"
                    />
                  </Col>
                  <Col xs={6}>
                    <Field
                      component={TextField}
                      fullWidth
                      id="chronology"
                      label={<FormattedMessage id="ui-receiving.piece.chronology" />}
                      name="chronology"
                      type="text"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs>
                    <FieldSelectFinal
                      dataOptions={pieceFormatOptions}
                      disabled={!isNotReceived}
                      label={<FormattedMessage id="ui-receiving.piece.format" />}
                      name="format"
                      required
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs>
                    <FieldDatepickerFinal
                      labelId="ui-receiving.piece.receiptDate"
                      name="receiptDate"
                      usePortal
                    />
                  </Col>
                  <Col xs>
                    <Field
                      component={TextArea}
                      fullWidth
                      label={<FormattedMessage id="ui-receiving.piece.comment" />}
                      name="comment"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs>
                    <Field
                      component={TextArea}
                      fullWidth
                      label={<FormattedMessage id="ui-receiving.piece.internalNote" />}
                      name="internalNote"
                    />
                  </Col>
                  <Col xs>
                    <Field
                      component={TextArea}
                      fullWidth
                      label={<FormattedMessage id="ui-receiving.piece.externalNote" />}
                      name="externalNote"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <LineLocationsView
                      poLine={poLine}
                      locations={locations}
                    />
                  </Col>

                  {
                    Boolean(instanceId) && (
                      <Col xs>
                        <CreateItemField
                          createInventoryValues={createInventoryValues}
                          instanceId={instanceId}
                          label={<FormattedMessage id="ui-receiving.piece.createItem" />}
                          piece={formValues}
                        />
                      </Col>
                    )
                  }

                  <Col xs>
                    <Field
                      component={Checkbox}
                      fullWidth
                      label={<FormattedMessage id="ui-receiving.piece.supplement" />}
                      name="supplement"
                      type="checkbox"
                      vertical
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <FieldInventory
                      instanceId={isLocationRequired ? instanceId : undefined}
                      locationIds={locationIds}
                      locations={locations}
                      holdingName="holdingId"
                      locationName="locationId"
                      onChange={mutators.setLocationValue}
                      disabled={!isNotReceived}
                      required={isLocationRequired}
                    />
                  </Col>

                  {
                    isLocationRequired && (
                      <>
                        <Col xs={3}>
                          <Field
                            component={Checkbox}
                            fullWidth
                            label={<FormattedMessage id="ui-receiving.piece.displayOnHolding" />}
                            name="displayOnHolding"
                            type="checkbox"
                            vertical
                            onChange={onChangeDisplayOnHolding}
                          />
                        </Col>

                        {
                          false && (
                            <Col xs={3}>
                              <Field
                                component={Checkbox}
                                disabled={!formValues.displayOnHolding}
                                fullWidth
                                label={<FormattedMessage id="ui-receiving.piece.discoverySuppress" />}
                                name="discoverySuppress"
                                type="checkbox"
                                vertical
                              />
                            </Col>
                          )
                        }
                      </>
                    )
                  }
                </Row>
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
};

AddPieceModal.defaultProps = {
  pieceFormatOptions: [],
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
