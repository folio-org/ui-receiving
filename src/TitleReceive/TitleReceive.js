import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Checkbox,
  MultiColumnList,
  Pane,
  Paneset,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import {
  LocationLookup,
} from '@folio/stripes/smart-components';
import {
  FieldSelectFinal,
  FormFooter,
  getItemStatusLabel,
} from '@folio/stripes-acq-components';

import {
  PIECE_FORMAT_LABELS,
} from '../common/constants';

const visibleColumns = ['checked', 'barcode', 'format', 'hasRequest', 'comments', 'location', 'itemStatus', 'callNumber'];
const field = 'receivedItems';

const TitleReceiveList = ({ fields, props: { locationOptions, selectLocation, toggleCheckedAll } }) => {
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
        hasRequest: record => Boolean(record.request) && <FormattedMessage id="ui-receiving.piece.request.isOpened" />,
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

const TitleReceive = ({
  form,
  handleSubmit,
  locationOptions,
  onCancel,
  paneTitle,
  pristine,
  submitting,
  values,
}) => {
  const paneFooter = (
    <FormFooter
      handleSubmit={handleSubmit}
      isSubmitDisabled={values[field].every(({ checked }) => !checked)}
      label={<FormattedMessage id="ui-receiving.title.details.button.receive" />}
      onCancel={onCancel}
      pristine={pristine}
      submitting={submitting}
    />
  );

  return (
    <form>
      <Paneset>
        <Pane
          defaultWidth="fill"
          dismissible
          footer={paneFooter}
          id="pane-title-receive-list"
          onClose={onCancel}
          paneTitle={paneTitle}
        >
          <FieldArray
            component={TitleReceiveList}
            id="receivedItems"
            name="receivedItems"
            props={{
              locationOptions,
              selectLocation: form.mutators.setLocationValue,
              toggleCheckedAll: form.mutators.toggleCheckedAll,
            }}
          />
        </Pane>
      </Paneset>
    </form>
  );
};

TitleReceive.propTypes = {
  form: PropTypes.object,  // form object to get initialValues
  handleSubmit: PropTypes.func.isRequired,
  locationOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCancel: PropTypes.func.isRequired,
  paneTitle: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,  // current form values
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
  mutators: {
    setLocationValue: (args, state, tools) => {
      const id = args[0];
      const fieldName = args[1];

      tools.changeValue(state, fieldName, () => id);
    },
    toggleCheckedAll: (args, state, tools) => {
      const isChecked = !!args[0];

      state.formState.values[field].forEach((_, i) => {
        tools.changeValue(state, `${field}[${i}].checked`, () => isChecked);
      });
    },
  },
})(TitleReceive);
