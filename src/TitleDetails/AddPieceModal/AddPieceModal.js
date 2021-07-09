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
  Modal,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  FieldDatepickerFinal,
  FieldInventory,
  FieldSelectFinal,
  INVENTORY_RECORDS_TYPE,
  ModalFooter,
  PIECE_STATUS,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { CreateItemField } from '../../common/components';

const AddPieceModal = ({
  close,
  createInventoryValues,
  deletePiece,
  form,
  handleSubmit,
  hasValidationErrors,
  instanceId,
  isManuallyAddPieces,
  locationIds,
  locations,
  onCheckIn,
  pieceFormatOptions,
  values: formValues,
}) => {
  const { caption, format, id, receivingStatus } = formValues;
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
    deletePiece({ id, caption });
  }, [caption, close, deletePiece, id]);

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
      {isManuallyAddPieces && (
        <Button
          marginBottom0
          onClick={toggleDeleteConfirmation}
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

  return (
    <Modal
      enforceFocus={false}
      footer={footer}
      id="add-piece-modal"
      label={<FormattedMessage id={labelId} />}
      open
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
            <FieldInventory
              instanceId={instanceId}
              locationIds={locationIds}
              locations={locations}

              holdingName="holdingId"
              locationName="locationId"

              onChange={form.mutators.setLocationValue}
              disabled={!isNotReceived}
              required={isLocationRequired}
            />
          </Col>

          <Col xs>
            <CreateItemField
              createInventoryValues={createInventoryValues}
              instanceId={instanceId}
              label={<FormattedMessage id="ui-receiving.piece.createItem" />}
              piece={formValues}
            />
          </Col>
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
      </form>
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
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.object,
  values: PropTypes.object.isRequired,
  instanceId: PropTypes.string,
  isManuallyAddPieces: PropTypes.bool,
  onCheckIn: PropTypes.func.isRequired,
  pieceFormatOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  hasValidationErrors: PropTypes.bool.isRequired,
  locationIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
};

AddPieceModal.defaultProps = {
  isManuallyAddPieces: false,
  pieceFormatOptions: [],
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { hasValidationErrors: true, values: true },
  mutators: {
    setLocationValue: (args, state, tools) => {
      const [location, locationField, holdingFieldName, holdingId] = args;

      tools.changeValue(state, locationField, () => location?.id || location);

      if (holdingFieldName) {
        tools.changeValue(state, holdingFieldName, () => holdingId);
      }
    },
  },
})(AddPieceModal);
