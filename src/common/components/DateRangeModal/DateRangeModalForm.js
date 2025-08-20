import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  ConfirmationModal,
  Row,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import {
  FieldDatepickerFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  isAfterDay,
  isBeforeDay,
} from '../../utils';

const excludeFutureDays = (endDate) => (day) => {
  return isAfterDay(day, endDate);
};

const excludePreviousDays = (startDate) => (day) => {
  return isBeforeDay(day, startDate);
};

const DateRangeModalForm = ({
  confirmLabel,
  disabled = false,
  endDateName = 'endDate',
  endDateRequired = true,
  handleSubmit,
  onCancel,
  open,
  startDateName = 'startDate',
  startDateRequired = true,
  submitting,
  values,
}) => {
  const { startDate, endDate } = values;

  const validateStartDate = useCallback((value, formValues) => {
    return (
      (startDateRequired && validateRequired(value)) || (
        isAfterDay(value, formValues.endDate)
          ? <FormattedMessage id="ui-receiving.validation.dateRange.startDate.beforeEndDate" />
          : undefined
      )
    );
  }, [startDateRequired]);

  const validateEndDate = useCallback((value, formValues) => {
    return (
      (endDateRequired && validateRequired(value)) || (
        isBeforeDay(value, formValues.startDate)
          ? <FormattedMessage id="ui-receiving.validation.dateRange.endDate.afterStartDate" />
          : undefined
      )
    );
  }, [endDateRequired]);

  const message = (
    <Row>
      <Col xs>
        <FieldDatepickerFinal
          label={<FormattedMessage id="ui-receiving.piece.modal.expectedDateRange.startDate" />}
          usePortal
          name={startDateName}
          required={startDateRequired}
          validate={validateStartDate}
          exclude={endDate ? excludeFutureDays(endDate) : undefined}
        />
      </Col>
      <Col xs>
        <FieldDatepickerFinal
          label={<FormattedMessage id="ui-receiving.piece.modal.expectedDateRange.endDate" />}
          usePortal
          name={endDateName}
          required={endDateRequired}
          validate={validateEndDate}
          exclude={startDate ? excludePreviousDays(startDate) : undefined}
        />
      </Col>
    </Row>
  );

  return (
    <form onSubmit={handleSubmit}>
      <ConfirmationModal
        id="date-range-modal"
        heading={<FormattedMessage id="ui-receiving.piece.modal.expectedDateRange.heading" />}
        message={message}
        open={open}
        onCancel={onCancel}
        onConfirm={handleSubmit}
        confirmLabel={confirmLabel}
        isConfirmButtonDisabled={disabled || submitting}
      />
    </form>
  );
};

DateRangeModalForm.propTypes = {
  confirmLabel: PropTypes.node,
  disabled: PropTypes.bool,
  endDateName: PropTypes.string,
  endDateRequired: PropTypes.bool,
  handleSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  open: PropTypes.bool,
  startDateName: PropTypes.string,
  startDateRequired: PropTypes.bool,
  submitting: PropTypes.bool,
  values: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(DateRangeModalForm);
