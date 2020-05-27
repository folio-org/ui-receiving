import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  MessageBanner,
  Pane,
  Paneset,
} from '@folio/stripes/components';
import {
  FormFooter,
} from '@folio/stripes-acq-components';

import { TitleReceiveList } from './TitleReceiveList';

const FIELD_NAME = 'receivedItems';

const TitleReceive = ({
  createInventoryValues,
  form,
  handleSubmit,
  instanceId,
  onCancel,
  paneTitle,
  pristine,
  receivingNote,
  submitting,
  values,
}) => {
  const paneFooter = (
    <FormFooter
      handleSubmit={handleSubmit}
      isSubmitDisabled={values[FIELD_NAME].every(({ checked }) => !checked)}
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
          {receivingNote && (
            <MessageBanner>
              {receivingNote}
            </MessageBanner>
          )}
          <FieldArray
            component={TitleReceiveList}
            id="receivedItems"
            name={FIELD_NAME}
            props={{
              createInventoryValues,
              instanceId,
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
  createInventoryValues: PropTypes.object.isRequired,
  form: PropTypes.object,  // form object to get initialValues
  handleSubmit: PropTypes.func.isRequired,
  instanceId: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  paneTitle: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  receivingNote: PropTypes.string,
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

      state.formState.values[FIELD_NAME].forEach((_, i) => {
        tools.changeValue(state, `${FIELD_NAME}[${i}].checked`, () => isChecked);
      });
    },
  },
})(TitleReceive);
