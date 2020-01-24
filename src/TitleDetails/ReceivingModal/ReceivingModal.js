import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { get } from 'lodash';

import {
  Button,
  Col,
  KeyValue,
  Modal,
  ModalFooter,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { FieldSelectFinal } from '@folio/stripes-acq-components';

import { getItemStatusLabel } from '../utils';

const ReceivingModal = ({
  close,
  form,
  handleSubmit,
  locations,
  poLineNumber,
  title,
}) => {
  const initialValues = get(form.getState(), 'initialValues', {});

  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        data-test-receive-piece
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-receiving.piece.actions.receive" />
      </Button>
      <Button
        data-test-receive-piece-cancel
        onClick={close}
      >
        <FormattedMessage id="ui-receiving.piece.actions.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      footer={footer}
      id="receiving-modal"
      label={`${poLineNumber} - ${title}`}
      open
    >
      <form>
        <Row>
          <Col xs={6}>
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-receiving.piece.barcode" />}
              name="barcode"
              type="text"
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-receiving.piece.itemStatus" />}
              value={getItemStatusLabel(initialValues.itemStatus)}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-receiving.piece.callNumber" />}
              name="callNumber"
              type="text"
            />
          </Col>
        </Row>
        <Row>
          <Col xs>
            <FieldSelectFinal
              dataOptions={locations}
              fullWidth
              label={<FormattedMessage id="ui-receiving.piece.location" />}
              name="locationId"
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
            <KeyValue
              label={<FormattedMessage id="ui-receiving.piece.format" />}
              value={get(initialValues, 'format', '')}
            />
          </Col>
          <Col xs>
            <KeyValue label={<FormattedMessage id="ui-receiving.piece.request" />}>
              {Boolean(initialValues.request) && <FormattedMessage id="ui-receiving.piece.request.isOpened" />}
            </KeyValue>
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

ReceivingModal.propTypes = {
  close: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  form: PropTypes.object,
  poLineNumber: PropTypes.string,
  title: PropTypes.string,
};

ReceivingModal.defaultProps = {
  locations: [],
  poLineNumber: '',
  title: '',
};

export default stripesFinalForm({
  navigationCheck: true,
})(ReceivingModal);
