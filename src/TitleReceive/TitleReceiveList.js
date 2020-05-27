import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Checkbox,
  MultiColumnList,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import {
  FieldLocationFinal,
  getItemStatusLabel,
  PIECE_FORMAT_LABELS,
} from '@folio/stripes-acq-components';

import { CreateItemField } from '../common/components';

const visibleColumns = [
  'checked',
  'caption',
  'barcode',
  'format',
  'hasRequest',
  'comments',
  'location',
  'itemStatus',
  'callNumber',
  'isCreateItem',
];

export const TitleReceiveList = ({
  fields,
  props: { createInventoryValues, instanceId, selectLocation, toggleCheckedAll },
}) => {
  const field = fields.name;
  const cellFormatters = useMemo(
    () => {
      return {
        caption: record => (
          <Field
            name={`${field}[${record.rowIndex}].caption`}
            component={TextField}
            marginBottom0
            fullWidth
          />
        ),
        barcode: record => (
          <Field
            name={`${field}[${record.rowIndex}].barcode`}
            component={TextField}
            marginBottom0
            fullWidth
          />
        ),
        comments: record => (
          <Field
            name={`${field}[${record.rowIndex}].comment`}
            component={TextArea}
            fullWidth
          />
        ),
        checked: record => (
          <Field
            data-test-title-receive-checked
            name={`${field}[${record.rowIndex}].checked`}
            component={Checkbox}
            type="checkbox"
          />
        ),
        itemStatus: ({ itemStatus }) => getItemStatusLabel(itemStatus),
        callNumber: record => (
          <Field
            name={`${field}[${record.rowIndex}].callNumber`}
            component={TextField}
            marginBottom0
            fullWidth
          />
        ),
        location: record => (
          <FieldLocationFinal
            locationId={fields.value[record.rowIndex]?.locationId}
            onChange={({ id }) => selectLocation(id, `${field}[${record.rowIndex}].locationId`)}
            name={`${field}[${record.rowIndex}].locationId`}
          />
        ),
        hasRequest: record => (
          record.request
            ? <FormattedMessage id="ui-receiving.piece.request.isOpened" />
            : '-'
        ),
        format: ({ format }) => PIECE_FORMAT_LABELS[format],
        isCreateItem: piece => (
          <CreateItemField
            createInventoryValues={createInventoryValues}
            instanceId={instanceId}
            piece={piece}
          />
        ),
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
          onChange={toggleAll}
        />
      ),
      caption: <FormattedMessage id="ui-receiving.piece.caption" />,
      barcode: <FormattedMessage id="ui-receiving.piece.barcode" />,
      format: <FormattedMessage id="ui-receiving.piece.format" />,
      hasRequest: <FormattedMessage id="ui-receiving.piece.request" />,
      comments: <FormattedMessage id="ui-receiving.piece.comment" />,
      location: <FormattedMessage id="ui-receiving.piece.location" />,
      itemStatus: <FormattedMessage id="ui-receiving.piece.itemStatus" />,
      callNumber: <FormattedMessage id="ui-receiving.piece.callNumber" />,
      isCreateItem: <FormattedMessage id="ui-receiving.piece.createItem" />,
    }),
    [isAllChecked, toggleAll],
  );

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={fields.value}
      formatter={cellFormatters}
      id="title-receive-list"
      interactive={false}
      totalCount={fields.value.length}
      visibleColumns={visibleColumns}
    />
  );
};

TitleReceiveList.propTypes = {
  fields: PropTypes.object.isRequired,
  props: PropTypes.shape({
    createInventoryValues: PropTypes.object.isRequired,
    instanceId: PropTypes.string.isRequired,
    selectLocation: PropTypes.func.isRequired,
    toggleCheckedAll: PropTypes.func.isRequired,
  }).isRequired,
};
