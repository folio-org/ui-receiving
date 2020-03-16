import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Checkbox,
  MultiColumnList,
  TextArea,
} from '@folio/stripes/components';

import { PIECE_FORMAT_LABELS } from '../common/constants';

const visibleColumns = [
  'checked',
  'barcode',
  'caption',
  'format',
  'hasRequest',
  'comments',
  'location',
  'callNumber',
];

export const TitleUnreceiveList = ({ fields, props: { pieceLocationMap, toggleCheckedAll } }) => {
  const field = fields.name;
  const cellFormatters = useMemo(
    () => {
      return {
        comments: record => (
          <Field
            name={`${field}[${record.rowIndex}].comment`}
            component={TextArea}
            fullWidth
          />
        ),
        checked: record => (
          <Field
            data-test-title-unreceive-checked
            name={`${field}[${record.rowIndex}].checked`}
            component={Checkbox}
            type="checkbox"
          />
        ),
        location: ({ locationId }) => pieceLocationMap[locationId],
        hasRequest: record => (
          record.request
            ? <FormattedMessage id="ui-receiving.piece.request.isOpened" />
            : '-'
        ),
        format: ({ format }) => PIECE_FORMAT_LABELS[format],
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pieceLocationMap],
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
        />
      ),
      barcode: <FormattedMessage id="ui-receiving.piece.barcode" />,
      caption: <FormattedMessage id="ui-receiving.piece.caption" />,
      format: <FormattedMessage id="ui-receiving.piece.format" />,
      hasRequest: <FormattedMessage id="ui-receiving.piece.request" />,
      comments: <FormattedMessage id="ui-receiving.piece.comment" />,
      location: <FormattedMessage id="ui-receiving.piece.location" />,
      callNumber: <FormattedMessage id="ui-receiving.piece.callNumber" />,
    }),
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
    toggleCheckedAll: PropTypes.func.isRequired,
  }).isRequired,
};
