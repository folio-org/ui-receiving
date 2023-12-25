import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Checkbox,
  MultiColumnList,
  TextArea,
} from '@folio/stripes/components';
import { getHoldingLocationName } from '@folio/stripes-acq-components';

import {
  PIECE_COLUMNS,
  PIECE_COLUMN_BASE_FORMATTER,
  UNRECEIVABLE_PIECE_COLUMN_MAPPING,
} from '../TitleDetails/constants';

const visibleColumns = [
  'checked',
  PIECE_COLUMNS.barcode,
  PIECE_COLUMNS.caption,
  PIECE_COLUMNS.enumeration,
  PIECE_COLUMNS.format,
  PIECE_COLUMNS.request,
  PIECE_COLUMNS.comment,
  PIECE_COLUMNS.location,
  PIECE_COLUMNS.callNumber,
];

export const TitleExpectList = ({ fields, props: { pieceLocationMap, pieceHoldingMap, toggleCheckedAll } }) => {
  const intl = useIntl();

  const field = fields.name;
  const isAllChecked = useMemo(() => fields.value.every(({ checked }) => !!checked), [fields]);

  const formatter = useMemo(() => {
    return {
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
          ? getHoldingLocationName(pieceHoldingMap[holdingId], pieceLocationMap)
          : (pieceLocationMap[locationId]?.name && `${pieceLocationMap[locationId].name} (${pieceLocationMap[locationId].code})`) || ''
      ),
    };
  }, [field, intl, pieceHoldingMap, pieceLocationMap]);

  const toggleAll = useCallback(() => {
    toggleCheckedAll(!isAllChecked);
  }, [isAllChecked, toggleCheckedAll]);

  const columnMapping = useMemo(
    () => ({
      checked: (
        <Checkbox
          checked={isAllChecked}
          onChange={toggleAll}
          aria-label={intl.formatMessage({ id: 'ui-receiving.piece.actions.selectAll' })}
        />
      ),
      location: <FormattedMessage id="ui-receiving.piece.location" />,
      ...UNRECEIVABLE_PIECE_COLUMN_MAPPING,
    }),
    [intl, isAllChecked, toggleAll],
  );

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={fields.value}
      formatter={formatter}
      id="title-expect-list"
      interactive={false}
      totalCount={fields.value.length}
      visibleColumns={visibleColumns}
    />
  );
};

TitleExpectList.propTypes = {
  fields: PropTypes.object.isRequired,
  props: PropTypes.shape({
    pieceLocationMap: PropTypes.object,
    pieceHoldingMap: PropTypes.object,
    toggleCheckedAll: PropTypes.func.isRequired,
  }).isRequired,
};
