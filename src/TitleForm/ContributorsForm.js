import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  Label,
  RepeatableField,
  Row,
  TextField,
} from '@folio/stripes/components';
import {
  FieldSelectFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

const headLabels = (
  <Row>
    <Col xs>
      <Label
        id="contributorFormContributorLabel"
        required
      >
        <FormattedMessage id="ui-receiving.title.contributors.contributor" />
      </Label>
    </Col>

    <Col xs>
      <Label
        id="contributorFormContributorTypeLabel"
        required
      >
        <FormattedMessage id="ui-receiving.title.contributors.contributorType" />
      </Label>
    </Col>
  </Row>
);

function ContributorsForm({ contributorNameTypes, disabled }) {
  const contributorNameTypesOptions = contributorNameTypes.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  const renderSubForm = (elem) => {
    return (
      <Row>
        <Col xs>
          <Field
            aria-labelledby="contributorFormContributorLabel"
            component={TextField}
            disabled={disabled}
            fullWidth
            name={`${elem}.contributor`}
            required
            validate={validateRequired}
          />
        </Col>
        <Col xs>
          <FieldSelectFinal
            aria-labelledby="contributorFormContributorTypeLabel"
            dataOptions={contributorNameTypesOptions}
            disabled={disabled}
            fullWidth
            name={`${elem}.contributorNameTypeId`}
            required
          />
        </Col>
      </Row>
    );
  };

  return (
    <FieldArray
      addLabel={<FormattedMessage id="ui-receiving.title.contributors.add" />}
      component={RepeatableField}
      headLabels={headLabels}
      id="contributors"
      name="contributors"
      props={{
        canAdd: !disabled,
        canRemove: !disabled,
      }}
      renderField={renderSubForm}
    />
  );
}

ContributorsForm.propTypes = {
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
};

ContributorsForm.defaultProps = {
  contributorNameTypes: [],
  disabled: false,
};

export default ContributorsForm;
