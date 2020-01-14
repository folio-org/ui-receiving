import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { get } from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Col,
  Modal,
  ModalFooter,
  Row,
  TextField,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  validateRequired,
} from '@folio/stripes-acq-components';

const footer = (onCancel, onSave, submitting, pristine) => (
  <ModalFooter>
    <Button
      buttonStyle="primary"
      data-test-save-title-save
      disabled={submitting || pristine}
      onClick={onSave}
    >
      <FormattedMessage id="ui-receiving.title.edit.save" />
    </Button>
    <Button
      data-test-save-title-cancel
      disabled={submitting}
      onClick={onCancel}
    >
      <FormattedMessage id="ui-receiving.title.edit.cancel" />
    </Button>
  </ModalFooter>
);

const TitleEdit = ({
  handleSubmit,
  form,
  onCancel,
  pristine,
  submitting,
  // values,
}) => {
  const initialValues = get(form.getState(), 'initialValues', {});
  const { metadata } = initialValues;

  const addInstance = form.mutators.setTitleValue;
  const addLines = form.mutators.setPOLNumberValue;

  return (
    <Modal
      dismissible
      footer={footer(onCancel, handleSubmit, submitting, pristine)}
      id="edit-title-modal"
      label={<FormattedMessage id="ui-receiving.title.modalLabel.edit" />}
      open
      onClose={onCancel}
    >
      <form>
        {metadata && <ViewMetaData metadata={metadata} />}
        <Row>
          <Col
            data-test-col-title-title
            xs={6}
          >
            <Field
              component={TextField}
              disabled
              label={<FormattedMessage id="ui-receiving.titles.title" />}
              name="title"
              required
              type="text"
              validate={validateRequired}
            />
            <Pluggable
              aria-haspopup="true"
              dataKey="instances"
              searchButtonStyle="link"
              searchLabel={<FormattedMessage id="ui-receiving.title.titleLookUp" />}
              selectInstance={addInstance}
              type="find-instance"
            >
              <FormattedMessage id="ui-receiving.title.titleLookUpNoPlugin" />
            </Pluggable>
          </Col>
          <Col
            data-test-col-title-line-number
            xs={6}
          >
            <Field
              component={TextField}
              disabled
              label={<FormattedMessage id="ui-receiving.titles.lineNumber" />}
              name="poLineNumber"
              required
              type="text"
              validate={validateRequired}
            />
            <Pluggable
              addLines={addLines}
              aria-haspopup="true"
              dataKey="find-po-line"
              isSingleSelect
              searchButtonStyle="link"
              searchLabel={<FormattedMessage id="ui-receiving.title.lineLookUp" />}
              type="find-po-line"
            >
              <FormattedMessage id="ui-invoice.find-po-line-plugin-unavailable" />
            </Pluggable>
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

TitleEdit.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.object,  // form object to get initialValues
  onCancel: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  // values: PropTypes.object.isRequired,  // current form values
};

export default stripesFinalForm({
  navigationCheck: true,
  // subscription: { values: true },
  mutators: {
    setTitleValue: (args, state, tools) => {
      const { id, title } = get(args, '0', {});

      tools.changeValue(state, 'title', () => title);
      tools.changeValue(state, 'instanceId', () => id);
    },
    setPOLNumberValue: (args, state, tools) => {
      const { id, poLineNumber } = get(args, '0.0', {});

      tools.changeValue(state, 'poLineNumber', () => poLineNumber);
      tools.changeValue(state, 'poLineId', () => id);
    },
  },
})(TitleEdit);
