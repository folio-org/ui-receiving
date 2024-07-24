import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  TextArea,
} from '@folio/stripes/components';
import { getHoldingLocationName } from '@folio/stripes-acq-components';

import {
  PIECE_COLUMN_BASE_FORMATTER,
  UNRECEIVABLE_PIECE_COLUMN_MAPPING,
} from '../Piece';

export const getResultFormatter = ({ field, intl, pieceHoldingMap, pieceLocationMap }) => ({
  ...PIECE_COLUMN_BASE_FORMATTER,
  checked: record => (
    <Field
      data-test-title-unreceive-checke
      name={`${field}[${record.rowIndex}].checked`}
      component={Checkbox}
      type="checkbox"
      aria-label={intl.formatMessage({ id: 'ui-receiving.piece.actions.select' })}
    />
  ),
  comment: record => (
    <Field
      name={`${field}[${record.rowIndex}].comment`}
      component={TextArea}
      aria-label={intl.formatMessage({ id: 'ui-receiving.piece.comment' })}
      fullWidth
    />
  ),
  location: ({ locationId, holdingId }) => (
    holdingId
      ? getHoldingLocationName(pieceHoldingMap[holdingId], pieceLocationMap, intl.formatMessage({ id: 'ui-receiving.titles.invalidReference' }))
      : (pieceLocationMap[locationId]?.name && `${pieceLocationMap[locationId].name} (${pieceLocationMap[locationId].code})`) || ''
  ),
});

export const getColumnMapping = ({ intl, isAllChecked, toggleAll }) => ({
  checked: (
    <Checkbox
      checked={isAllChecked}
      onChange={toggleAll}
      aria-label={intl.formatMessage({ id: 'ui-receiving.piece.actions.selectAll' })}
    />
  ),
  location: <FormattedMessage id="ui-receiving.piece.location" />,
  ...UNRECEIVABLE_PIECE_COLUMN_MAPPING,
});
