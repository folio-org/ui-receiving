import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  checkScope,
  HasCommand,
  MessageBanner,
  Pane,
  Paneset,
} from '@folio/stripes/components';
import {
  FormFooter,
  handleKeyCommand,
} from '@folio/stripes-acq-components';

import { LineLocationsView } from '../common/components';
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
  locations,
  poLine,
}) => {
  const isReceiveDisabled = values[FIELD_NAME].every(({ checked }) => !checked);
  const poLineLocationIds = useMemo(
    () => poLine?.locations?.map(({ locationId }) => locationId).filter(Boolean),
    [poLine],
  );

  const paneFooter = (
    <FormFooter
      handleSubmit={handleSubmit}
      isSubmitDisabled={isReceiveDisabled}
      label={<FormattedMessage id="ui-receiving.title.details.button.receive" />}
      onCancel={onCancel}
      pristine={pristine}
      submitting={submitting}
    />
  );

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onCancel),
    },
    {
      name: 'receive',
      shortcut: 'mod + alt + r',
      handler: handleKeyCommand(handleSubmit, { disabled: isReceiveDisabled }),
    },
  ];

  return (
    <form>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Paneset>
          <Pane
            defaultWidth="fill"
            dismissible
            footer={paneFooter}
            id="pane-title-receive-list"
            onClose={onCancel}
            paneTitle={paneTitle}
          >
            <LineLocationsView
              poLine={poLine}
              locations={locations}
            />
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
                locations,
                poLineLocationIds,
              }}
            />
          </Pane>
        </Paneset>
      </HasCommand>
    </form>
  );
};

TitleReceive.propTypes = {
  createInventoryValues: PropTypes.object.isRequired,
  form: PropTypes.object,  // form object to get initialValues
  handleSubmit: PropTypes.func.isRequired,
  instanceId: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  paneTitle: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  receivingNote: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,  // current form values
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  poLine: PropTypes.object.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
  mutators: {
    setLocationValue: (args, state, tools) => {
      const [location, locationField, holdingFieldName, holdingId] = args;

      tools.changeValue(state, locationField, () => location?.id || location);

      if (holdingFieldName) {
        tools.changeValue(state, holdingFieldName, () => holdingId);
      }
    },
    toggleCheckedAll: (args, state, tools) => {
      const isChecked = !!args[0];

      state.formState.values[FIELD_NAME].forEach((_, i) => {
        tools.changeValue(state, `${FIELD_NAME}[${i}].checked`, () => isChecked);
      });
    },
  },
})(TitleReceive);
