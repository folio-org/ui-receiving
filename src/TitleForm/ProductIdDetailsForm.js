import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  Row,
  TextField,
  RepeatableField,
} from '@folio/stripes/components';
import {
  FieldSelectFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

function ProductIdDetailsForm({ disabled, identifierTypes }) {
  const removeField = useCallback((fields, index) => {
    fields.remove(index);
  }, []);

  if (!identifierTypes) return null;
  const identifierTypesOptions = identifierTypes.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  const renderSubForm = (elem) => {
    return (
      <Row>
        <Col xs>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.productId" />}
            name={`${elem}.productId`}
            disabled={disabled}
            required
            validate={validateRequired}
          />
        </Col>
        <Col xs>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.qualifier" />}
            name={`${elem}.qualifier`}
            disabled={disabled}
          />
        </Col>
        <Col xs>
          <FieldSelectFinal
            dataOptions={identifierTypesOptions}
            disabled={disabled}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.productIdType" />}
            name={`${elem}.productIdType`}
            required
            validate={validateRequired}
          />
        </Col>
      </Row>
    );
  };

  return (
    <FieldArray
      addLabel={<FormattedMessage id="ui-orders.itemDetails.addProductIdBtn" />}
      component={RepeatableField}
      emptyMessage={<FormattedMessage id="ui-orders.itemDetails.addProductId" />}
      id="productIds"
      legend={<FormattedMessage id="ui-orders.itemDetails.productIds" />}
      name="productIds"
      onRemove={removeField}
      props={{
        canAdd: !disabled,
        canRemove: !disabled,
      }}
      renderField={renderSubForm}
    />
  );
}

ProductIdDetailsForm.propTypes = {
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
};

ProductIdDetailsForm.defaultProps = {
  disabled: false,
};

export default ProductIdDetailsForm;
