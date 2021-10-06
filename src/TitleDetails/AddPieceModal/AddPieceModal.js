import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  includes,
} from 'lodash';

import {
  Button,
  Checkbox,
  Col,
  ConfirmationModal,
  HasCommand,
  Modal,
  Row,
  TextArea,
  TextField,
  checkScope,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
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

const AddPieceModal = ({
  close,
  createInventoryValues,
  deletePiece,
  canDeletePiece,
  form: { mutators, change },
  handleSubmit,
  hasValidationErrors,
  instanceId,
  locationIds,
  locations,
  onCheckIn,
  pieceFormatOptions,
  values: formValues,
  poLine,
}) => {
  const { enumeration, format, id, receivingStatus } = formValues;
  const isLocationRequired = includes(createInventoryValues[format], INVENTORY_RECORDS_TYPE.instanceAndHolding);
  const isNotReceived = receivingStatus !== PIECE_STATUS.received;
  const labelId = id ? 'ui-receiving.piece.addPieceModal.editTitle' : 'ui-receiving.piece.addPieceModal.title';
  const [isDeleteConfirmation, toggleDeleteConfirmation] = useModalToggle();

  const receive = useCallback(
    () => {
      onCheckIn(formValues);
      close();
    },
    [close, formValues, onCheckIn],
  );

  const onDelete = useCallback(() => {
    close();
    deletePiece({ id, enumeration });
  }, [enumeration, close, deletePiece, id]);

  const onChangeDisplayOnHolding = ({ target: { checked } }) => {
    change('displayOnHolding', checked);

    if (!checked) change('discoverySuppress', checked);
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
    <>
      {id && (
        <Button
          marginBottom0
          onClick={toggleDeleteConfirmation}
          disabled={!canDeletePiece}
        >
          <FormattedMessage id="ui-receiving.piece.actions.delete" />
        </Button>
      )}
      {isNotReceived && (
        <Button
          data-test-add-piece-check-in
          disabled={hasValidationErrors}
          marginBottom0
          onClick={receive}
        >
          <FormattedMessage id="ui-receiving.piece.actions.quickReceive" />
        </Button>
      )}
      <Button
        buttonStyle="primary"
        data-test-add-piece-save
        disabled={hasValidationErrors}
        marginBottom0
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-receiving.piece.actions.save" />
      </Button>
    </>
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
      handler: handleKeyCommand(handleSubmit, { disabled: hasValidationErrors }),
    },
    {
      name: 'receive',
      shortcut: 'mod + alt + r',
      handler: handleKeyCommand(receive, { disabled: hasValidationErrors }),
    },
  ];

  return (
    <Modal
      enforceFocus={false}
      footer={footer}
      id="add-piece-modal"
      label={<FormattedMessage id={labelId} />}
      open
    >
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <form>
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
              )
            }

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
          </Row>
        </form>
      </HasCommand>

      {isDeleteConfirmation && (
        <ConfirmationModal
          id="delete-piece-confirmation"
          confirmLabel={<FormattedMessage id="ui-receiving.piece.delete.confirm" />}
          heading={<FormattedMessage id="ui-receiving.piece.delete.heading" />}
          message={<FormattedMessage id="ui-receiving.piece.delete.message" />}
          onCancel={toggleDeleteConfirmation}
          onConfirm={onDelete}
          open
        />
      )}
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
