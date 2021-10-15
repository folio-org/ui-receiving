import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  checkScope,
  HasCommand,
  Pane,
  Paneset,
} from '@folio/stripes/components';
import {
  FormFooter,
  handleKeyCommand,
} from '@folio/stripes-acq-components';

import { TitleUnreceiveList } from './TitleUnreceiveList';

const FIELD_NAME = 'receivedItems';

const TitleUnreceive = ({
  form,
  handleSubmit,
  onCancel,
  paneTitle,
  pieceLocationMap,
  pieceHoldingMap,
  pristine,
  submitting,
  values,
}) => {
  const paneFooter = (
    <FormFooter
      data-test-unreceive-title-footer
      handleSubmit={handleSubmit}
      isSubmitDisabled={values[FIELD_NAME].every(({ checked }) => !checked)}
      label={<FormattedMessage id="ui-receiving.title.details.button.unreceive" />}
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
            data-test-unreceive-title-pane
            defaultWidth="fill"
            dismissible
            footer={paneFooter}
            id="pane-title-unreceive-list"
            onClose={onCancel}
            paneTitle={paneTitle}
          >
            <FieldArray
              component={TitleUnreceiveList}
              id="receivedItems"
              name={FIELD_NAME}
              props={{
                pieceLocationMap,
                pieceHoldingMap,
                toggleCheckedAll: form.mutators.toggleCheckedAll,
              }}
            />
          </Pane>
        </Paneset>
      </HasCommand>
    </form>
  );
};

TitleUnreceive.propTypes = {
  form: PropTypes.object,  // form object to get initialValues
  handleSubmit: PropTypes.func.isRequired,
  pieceLocationMap: PropTypes.object.isRequired,
  pieceHoldingMap: PropTypes.object.isRequired,
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
    toggleCheckedAll: (args, state, tools) => {
      const isChecked = !!args[0];

      state.formState.values[FIELD_NAME].forEach((_, i) => {
        tools.changeValue(state, `${FIELD_NAME}[${i}].checked`, () => isChecked);
      });
    },
  },
})(TitleUnreceive);
