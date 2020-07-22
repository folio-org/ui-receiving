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

const columnWidths = {
  location: '250px',
};

export const TitleReceiveList = ({
  fields,
  props: { createInventoryValues, instanceId, selectLocation, toggleCheckedAll, locations, poLineLocationIds },
}) => {
  const intl = useIntl();

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
            aria-label={intl.formatMessage({ id: 'ui-receiving.piece.caption' })}
          />
        ),
        barcode: record => (
          <Field
            name={`${field}[${record.rowIndex}].barcode`}
            component={TextField}
            disabled={!record.itemId && !record.isCreateItem}
            marginBottom0
            aria-label={intl.formatMessage({ id: 'ui-receiving.piece.barcode' })}
            fullWidth
          />
        ),
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
            data-test-title-receive-checked
            name={`${field}[${record.rowIndex}].checked`}
            component={Checkbox}
            type="checkbox"
            aria-label={intl.formatMessage({ id: 'ui-receiving.piece.actions.select' })}
          />
        ),
        itemStatus: ({ itemStatus }) => getItemStatusLabel(itemStatus),
        callNumber: record => (
          <Field
            name={`${field}[${record.rowIndex}].callNumber`}
            component={TextField}
            disabled={!record.itemId && !record.isCreateItem}
            marginBottom0
            aria-label={intl.formatMessage({ id: 'ui-receiving.piece.callNumber' })}
            fullWidth
          />
        ),
        location: record => {
          const locationId = fields.value[record.rowIndex]?.locationId;
          const locationIds = locationId ? [...new Set([...poLineLocationIds, locationId])] : poLineLocationIds;

          return (
            <FieldLocationFinal
              locationLookupLabel={<FormattedMessage id="ui-receiving.piece.locationLookup" />}
              prepopulatedLocationsIds={locationIds}
              locationsForDict={locations}
              name={`${field}[${record.rowIndex}].locationId`}
              onChange={({ id }) => selectLocation(id, `${field}[${record.rowIndex}].locationId`)}
            />
          );
        },
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
            name={`${field}[${piece.rowIndex}].isCreateItem`}
            piece={piece}
          />
        ),
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locations, poLineLocationIds],
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
          aria-label={intl.formatMessage({ id: 'ui-receiving.piece.actions.selectAll' })}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAllChecked, toggleAll],
  );

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      columnWidths={columnWidths}
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
    instanceId: PropTypes.string,
    selectLocation: PropTypes.func.isRequired,
    toggleCheckedAll: PropTypes.func.isRequired,
    poLineLocationIds: PropTypes.arrayOf(PropTypes.string),
    locations: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};
