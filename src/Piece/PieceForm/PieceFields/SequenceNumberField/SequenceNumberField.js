import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';

import { PIECE_FORM_FIELD_NAMES } from '../../../constants';

import css from '../PieceFields.css';

export const SequenceNumberField = ({
  isEditMode,
  nextSequenceNumber,
}) => {
  const sequenceNumberCount = isEditMode
    ? nextSequenceNumber - 1 // leave the current value in the scope
    : nextSequenceNumber;

  const validate = (val) => {
    if (typeof val !== 'number') return undefined;

    const min = 1;

    return val < min || val > sequenceNumberCount
      ? (
        <FormattedMessage
          id="ui-receiving.validation.numberRange"
          values={{
            min,
            max: sequenceNumberCount,
          }}
        />
      )
      : undefined;
  };

  return (
    <div className={css.sequenceNumber}>
      <Field
        component={TextField}
        id={PIECE_FORM_FIELD_NAMES.sequenceNumber}
        label={<FormattedMessage id="ui-receiving.piece.sequence" />}
        name={PIECE_FORM_FIELD_NAMES.sequenceNumber}
        parse={(v) => (v ? Number(v) : undefined)}
        type="number"
        validate={validate}
        validateFields={[]}
      />
      <div className={css.sequenceNumberScope}>
        <FormattedMessage
          id="ui-receiving.piece.sequence.scope"
          tagName="span"
          values={{ count: sequenceNumberCount }}
        />
      </div>
    </div>
  );
};

SequenceNumberField.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  nextSequenceNumber: PropTypes.number.isRequired,
};
