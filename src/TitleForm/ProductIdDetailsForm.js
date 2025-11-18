import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Label,
  Row,
  TextField,
  RepeatableField,
} from '@folio/stripes/components';
import {
  FieldSelectFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

const headLabels = (
  <Row>
    <Col xs>
      <Label
        id="productIdsFormProductIdLabel"
        required
      >
        <FormattedMessage id="ui-receiving.title.productIds.productId" />
      </Label>
    </Col>

    <Col xs>
      <Label id="productIdsFormQualifierLabel">
        <FormattedMessage id="ui-receiving.title.productIds.qualifier" />
      </Label>
    </Col>

    <Col xs>
      <Label
        id="productIdsFormProductIdTypeLabel"
        required
      >
        <FormattedMessage id="ui-receiving.title.productIds.productIdType" />
      </Label>
    </Col>
  </Row>
);

function ProductIdDetailsForm({
  disabled = false,
  identifierTypes,
}) {
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
            aria-labelledby="productIdsFormProductIdLabel"
            component={TextField}
            fullWidth
            name={`${elem}.productId`}
            disabled={disabled}
            required
            validate={validateRequired}
          />
        </Col>
        <Col xs>
          <Field
            aria-labelledby="productIdsFormQualifierLabel"
            component={TextField}
            fullWidth
            name={`${elem}.qualifier`}
            disabled={disabled}
          />
        </Col>
        <Col xs>
          <FieldSelectFinal
            aria-labelledby="productIdsFormProductIdTypeLabel"
            dataOptions={identifierTypesOptions}
            disabled={disabled}
            fullWidth
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
      addLabel={<FormattedMessage id="ui-receiving.title.productIds.add" />}
      component={RepeatableField}
      headLabels={headLabels}
      id="productIds"
      name="productIds"
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

export default ProductIdDetailsForm;
