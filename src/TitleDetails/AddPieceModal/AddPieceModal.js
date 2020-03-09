import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  get,
  includes,
} from 'lodash';

import { Pluggable } from '@folio/stripes/core';
import {
  Button,
  Checkbox,
  Col,
  Modal,
  ModalFooter,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import {
  LocationLookup,
} from '@folio/stripes/smart-components';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  FieldDatepickerFinal,
  FieldSelectFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  INVENTORY_RECORDS_TYPE,
} from '../constants';

const AddPieceModal = ({
  close,
  createInventoryValues,
  form,
  handleSubmit,
  instanceId,
  locations,
  onCheckIn,
  pieceFormatOptions,
}) => {
  const addItem = form.mutators.setItemValue;
  const selectLocation = form.mutators.setLocationValue;
  const formValues = get(form.getState(), 'values', {});
  const { format, id, itemId, locationId } = formValues;
  const isLocationRequired = includes(createInventoryValues[format], INVENTORY_RECORDS_TYPE.instanceAndHolding);
  const isAddItemRequired = includes(createInventoryValues[format], INVENTORY_RECORDS_TYPE.all);
  let isAddItemButtonDisabled = true;

  if (!itemId && locationId && isAddItemRequired) {
    isAddItemButtonDisabled = false;
  }

  const disabledButtonProps = isAddItemButtonDisabled ? { disabled: isAddItemButtonDisabled } : {};
  const labelId = id ? 'ui-receiving.piece.addPieceModal.editTitle' : 'ui-receiving.piece.addPieceModal.title';

  const receive = useCallback(
    () => onCheckIn(formValues),
    [formValues, onCheckIn],
  );

  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        data-test-add-piece-save
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-receiving.piece.actions.save" />
      </Button>
      <Button
        data-test-add-piece-check-in
        onClick={receive}
      >
        <FormattedMessage id="ui-receiving.piece.actions.receive" />
      </Button>
      <Pluggable
        addItem={addItem}
        aria-haspopup="true"
        disabled={isAddItemButtonDisabled}
        instanceId={instanceId}
        locationId={locationId}
        marginBottom0
        searchButtonStyle="default"
        searchLabel={<FormattedMessage id="ui-receiving.piece.actions.addItem" />}
        type="create-item"
        {...disabledButtonProps}
      >
        <FormattedMessage id="ui-receiving.title.titleLookUpNoPlugin" />
      </Pluggable>
      <Button
        data-test-add-piece-cancel
        onClick={close}
      >
        <FormattedMessage id="ui-receiving.piece.actions.cancel" />
      </Button>
    </ModalFooter>
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
              label={<FormattedMessage id="ui-receiving.piece.caption" />}
              name="caption"
              required
              type="text"
              validate={validateRequired}
            />
          </Col>
          <Col xs>
            <FieldSelectFinal
              dataOptions={pieceFormatOptions}
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
              required
              validate={validateRequired}
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
            <FieldSelectFinal
              dataOptions={locations}
              disabled
              fullWidth
              label={<FormattedMessage id="ui-receiving.piece.location" />}
              name="locationId"
              required={isLocationRequired}
            />
            <LocationLookup onLocationSelected={selectLocation} />
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
    </Modal>
  );
};

AddPieceModal.propTypes = {
  close: PropTypes.func.isRequired,
  createInventoryValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  form: PropTypes.object,
  instanceId: PropTypes.string,
  onCheckIn: PropTypes.func.isRequired,
  pieceFormatOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
};

AddPieceModal.defaultProps = {
  locations: [],
  pieceFormatOptions: [],
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
  mutators: {
    setItemValue: (args, state, tools) => {
      const { id } = get(args, '0', {});

      tools.changeValue(state, 'itemId', () => id);
    },
    setLocationValue: (args, state, tools) => {
      const { id } = get(args, '0', {});

      tools.changeValue(state, 'locationId', () => id);
    },
  },
})(AddPieceModal);
