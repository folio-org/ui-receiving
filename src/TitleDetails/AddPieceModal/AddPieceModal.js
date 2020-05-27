import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  get,
  includes,
} from 'lodash';

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
  INVENTORY_RECORDS_TYPE,
  ModalFooter,
} from '@folio/stripes-acq-components';

import { CreateItemField } from '../../common/components';

const AddPieceModal = ({
  close,
  createInventoryValues,
  form,
  handleSubmit,
  instanceId,
  onCheckIn,
  pieceFormatOptions,
  values: formValues,
}) => {
  const { format, id, locationId } = formValues;
  const isLocationRequired = includes(createInventoryValues[format], INVENTORY_RECORDS_TYPE.instanceAndHolding);

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
          <Col xs={6}>
            <FieldLocationFinal
              locationId={locationId}
              onChange={form.mutators.setLocationValue}
              labelId="ui-receiving.piece.location"
              name="locationId"
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
    </Modal>
  );
};

AddPieceModal.propTypes = {
  close: PropTypes.func.isRequired,
  createInventoryValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.object,
  values: PropTypes.object.isRequired,
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
    setLocationValue: (args, state, tools) => {
      const { id } = get(args, '0', {});

      tools.changeValue(state, 'locationId', () => id);
    },
  },
})(AddPieceModal);
