import PropTypes from 'prop-types';

import {
  FieldDatepickerFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  excludeClaimingPreviousDays,
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
      exclude={excludeClaimingPreviousDays}
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
