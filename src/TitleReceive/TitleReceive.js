import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  checkScope,
  HasCommand,
  Layout,
  MessageBanner,
  Pane,
  Paneset,
} from '@folio/stripes/components';
import {
  FormFooter,
  handleKeyCommand,
} from '@folio/stripes-acq-components';

import { LineLocationsView } from '../common/components';
import { setLocationValueFormMutator } from '../common/utils';
import { TitleReceiveList } from './TitleReceiveList';

const FIELD_NAME = 'receivedItems';

const TitleReceive = ({
  crossTenant = false,
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
              crossTenant={crossTenant}
              instanceId={instanceId}
              poLine={poLine}
              locations={locations}
            />
            {receivingNote && (
              <Layout className="marginTopHalf">
                <MessageBanner>
                  {receivingNote}
                </MessageBanner>
              </Layout>
            )}
            <FieldArray
              component={TitleReceiveList}
              id="receivedItems"
              name={FIELD_NAME}
              props={{
                crossTenant,
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
  crossTenant: PropTypes.bool,
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
    setLocationValue: setLocationValueFormMutator,
    toggleCheckedAll: (args, state, tools) => {
      const isChecked = !!args[0];

      state.formState.values[FIELD_NAME].forEach((_, i) => {
        tools.changeValue(state, `${FIELD_NAME}[${i}].checked`, () => isChecked);
      });
    },
  },
})(TitleReceive);
