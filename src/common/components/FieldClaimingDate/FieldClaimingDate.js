import PropTypes from 'prop-types';

import {
  FieldDatepickerFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  excludePreviousDays,
  validateClaimingDate,
} from './utils';

export const FieldClaimingDate = ({
  name,
  required,
  ...props
}) => {
  const validate = (value) => {
    return (
      (required && validateRequired(value))
      || validateClaimingDate(value)
    );
  };

  return (
    <FieldDatepickerFinal
      usePortal
      name={name}
      required={required}
      validate={validate}
      exclude={excludePreviousDays}
      {...props}
    />
  );
};

FieldClaimingDate.propTypes = {
  name: PropTypes.string,
  required: PropTypes.bool,
};

FieldClaimingDate.defaultProps = {
  name: 'claimingDate',
  required: true,
};
