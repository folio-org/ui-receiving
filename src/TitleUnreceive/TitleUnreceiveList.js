import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';

import {
  Checkbox,
  MultiColumnList,
  NoValue,
  TextArea,
} from '@folio/stripes/components';
import {
  getHoldingLocationName,
  PIECE_FORMAT_LABELS,
} from '@folio/stripes-acq-components';

const visibleColumns = [
  'checked',
  'barcode',
  'enumeration',
  'format',
  'hasRequest',
  'comments',
  'location',
  'callNumber',
];

export const TitleUnreceiveList = ({ fields, props: { pieceLocationMap, pieceHoldingMap, toggleCheckedAll } }) => {
  const intl = useIntl();

  const field = fields.name;
  const cellFormatters = useMemo(
    () => {
      return {
        comments: record => (
          <Field
            name={`${field}[${record.rowIndex}].comment`}
            component={TextArea}
            aria-label={intl.formatMessage({ id: 'ui-receiving.piece.comment' })}
            fullWidth
          />
        ),
        checked: record => (
          <Field
            data-test-title-unreceive-checked
            name={`${field}[${record.rowIndex}].checked`}
            component={Checkbox}
            type="checkbox"
            aria-label={intl.formatMessage({ id: 'ui-receiving.piece.actions.select' })}
          />
        ),
        location: ({ locationId, holdingId }) => (
          holdingId
            ? getHoldingLocationName(pieceHoldingMap[holdingId], pieceLocationMap)
            : (pieceLocationMap[locationId]?.name && `${pieceLocationMap[locationId].name} (${pieceLocationMap[locationId].code})`) || ''
        ),
        hasRequest: record => (
          record.request
            ? <FormattedMessage id="ui-receiving.piece.request.isOpened" />
            : <NoValue />
        ),
        format: ({ format }) => PIECE_FORMAT_LABELS[format],
        callNumber: record => record.callNumber || <NoValue />,
        barcode: record => record.barcode || <NoValue />,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pieceLocationMap, pieceHoldingMap],
  );

  const isAllChecked = fields.value.every(({ checked }) => !!checked);
  const toggleAll = useCallback(
    () => {
      toggleCheckedAll(!isAllChecked);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAllChecked],
  );

  const columnMapping = useMemo(
    () => ({
      checked: (
        <Checkbox
          checked={isAllChecked}
          data-test-unreceive-title-checked
          onChange={toggleAll}
          aria-label={intl.formatMessage({ id: 'ui-receiving.piece.actions.selectAll' })}
        />
      ),
      barcode: <FormattedMessage id="ui-receiving.piece.barcode" />,
      enumeration: <FormattedMessage id="ui-receiving.piece.enumeration" />,
      format: <FormattedMessage id="ui-receiving.piece.format" />,
      hasRequest: <FormattedMessage id="ui-receiving.piece.request" />,
      comments: <FormattedMessage id="ui-receiving.piece.comment" />,
      location: <FormattedMessage id="ui-receiving.piece.location" />,
      callNumber: <FormattedMessage id="ui-receiving.piece.callNumber" />,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAllChecked, toggleAll],
  );

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={fields.value}
      formatter={cellFormatters}
      id="title-unreceive-list"
      interactive={false}
      totalCount={fields.value.length}
      visibleColumns={visibleColumns}
    />
  );
};

TitleUnreceiveList.propTypes = {
  fields: PropTypes.object.isRequired,
  props: PropTypes.shape({
    pieceLocationMap: PropTypes.object,
    pieceHoldingMap: PropTypes.object,
    toggleCheckedAll: PropTypes.func.isRequired,
  }).isRequired,
};
