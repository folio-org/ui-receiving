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
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  FieldDatepickerFinal,
  FieldLocationFinal,
  FieldSelectFinal,
  ModalFooter,
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
  onCheckIn,
  pieceFormatOptions,
}) => {
  const addItem = form.mutators.setItemValue;
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
        data-test-add-piece-check-in
        marginBottom0
        onClick={receive}
      >
        <FormattedMessage id="ui-receiving.piece.actions.quickReceive" />
      </Button>
      <Button
        buttonStyle="primary"
        data-test-add-piece-save
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
              label={<FormattedMessage id="ui-receiving.piece.caption" />}
              name="caption"
              type="text"
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
            <FieldLocationFinal
              locationId={locationId}
              onChange={form.mutators.setLocationValue}
              labelId="ui-receiving.piece.location"
              name="locationId"
              required={isLocationRequired}
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
    </Modal>
  );
};

AddPieceModal.propTypes = {
  close: PropTypes.func.isRequired,
  createInventoryValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.object,
  instanceId: PropTypes.string,
  onCheckIn: PropTypes.func.isRequired,
  pieceFormatOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
};

AddPieceModal.defaultProps = {
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
