import PropTypes from 'prop-types';

import DateRangeModalForm from './DateRangeModalForm';

export const DateRangeModal = ({
  confirmLabel,
  disabled,
  endDateName,
  endDateRequired,
  open,
  onCancel,
  onConfirm,
  startDateName,
  startDateRequired,
}) => {
  return (
    <DateRangeModalForm
      confirmLabel={confirmLabel}
      disabled={disabled}
      endDateName={endDateName}
      endDateRequired={endDateRequired}
      open={open}
      onCancel={onCancel}
      onSubmit={onConfirm}
      startDateName={startDateName}
      startDateRequired={startDateRequired}
    />
  );
};

DateRangeModal.propTypes = {
  confirmLabel: PropTypes.node,
  disabled: PropTypes.bool,
  endDateName: PropTypes.string,
  endDateRequired: PropTypes.bool,
  open: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  startDateName: PropTypes.string,
  startDateRequired: PropTypes.bool,
};
