import { Field } from 'react-final-form';

import { Checkbox } from '@folio/stripes/components';

import { COLUMN_FORMATTER } from './constants';

export const buildOptions = (items) => {
  return items.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
};

export const getPieceColumnFormatter = ({ field, intl }) => {
  return {
    checked: record => (
      <Field
        name={`${field}[${record.rowIndex}].checked`}
        component={Checkbox}
        type="checkbox"
        aria-label={intl.formatMessage({ id: 'ui-receiving.piece.actions.select' })}
      />
    ),
    ...COLUMN_FORMATTER,
  };
};
