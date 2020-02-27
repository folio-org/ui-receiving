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
import { LocationLookup } from '@folio/stripes/smart-components';
import {
  FieldSelectFinal,
  getItemStatusLabel,
} from '@folio/stripes-acq-components';

import { PIECE_FORMAT_LABELS } from '../common/constants';

const visibleColumns = ['checked', 'barcode', 'format', 'hasRequest', 'comments', 'location', 'itemStatus', 'callNumber'];

export const TitleReceiveList = ({ fields, props: { locationOptions, selectLocation, toggleCheckedAll } }) => {
  const field = fields.name;
  const cellFormatters = useMemo(
    () => {
      return {
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
          <div>
            <FieldSelectFinal
              dataOptions={locationOptions}
              fullWidth
              name={`${field}[${record.rowIndex}].locationId`}
              marginBottom0
            />
            <LocationLookup
              marginBottom0
              onLocationSelected={({ id }) => selectLocation(id, `${field}[${record.rowIndex}].locationId`)}
            />
          </div>
        ),
        hasRequest: record => (
          record.request
            ? <FormattedMessage id="ui-receiving.piece.request.isOpened" />
            : '-'
        ),
        format: ({ format }) => PIECE_FORMAT_LABELS[format],
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locationOptions],
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
      barcode: <FormattedMessage id="ui-receiving.piece.barcode" />,
      format: <FormattedMessage id="ui-receiving.piece.format" />,
      hasRequest: <FormattedMessage id="ui-receiving.piece.request" />,
      comments: <FormattedMessage id="ui-receiving.piece.comment" />,
      location: <FormattedMessage id="ui-receiving.piece.location" />,
      itemStatus: <FormattedMessage id="ui-receiving.piece.itemStatus" />,
      callNumber: <FormattedMessage id="ui-receiving.piece.callNumber" />,
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
    locationOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectLocation: PropTypes.func.isRequired,
    toggleCheckedAll: PropTypes.func.isRequired,
  }).isRequired,
};
