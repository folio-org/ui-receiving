import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  FormFooter,
  handleKeyCommand,
} from '@folio/stripes-acq-components';
import {
  checkScope,
  HasCommand,
  Pane,
  Paneset,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import { setLocationValueFormMutator } from '../common/utils';
import { TitleBindPiecesCreateItemForm } from './TitleBindPiecesCreateItemForm';
import { TitleBindPiecesList } from './TitleBindPiecesList';

const FIELD_NAME = 'receivedItems';

const TitleBindPieces = ({
  form,
  handleSubmit,
  instanceId,
  onCancel,
  paneTitle,
  pristine,
  submitting,
  titleId,
  values,
  isLoading,
}) => {
  const disabled = useMemo(() => {
    if (!form.getState().valid) {
      return true;
    }

    return values[FIELD_NAME].every(({ checked }) => !checked);
  }, [form, values]);

  const paneFooter = (
    <FormFooter
      handleSubmit={handleSubmit}
      isSubmitDisabled={disabled || isLoading}
      label={<FormattedMessage id="ui-receiving.title.details.button.bind" />}
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
    <form onSubmit={handleSubmit}>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Paneset>
          <Pane
            dismissible
            defaultWidth="fill"
            footer={paneFooter}
            onClose={onCancel}
            paneTitle={paneTitle}
          >
            <TitleBindPiecesCreateItemForm
              instanceId={instanceId}
              selectLocation={form.mutators.setLocationValue}
              bindItemValues={values?.bindItem}
            />
            <FieldArray
              id={FIELD_NAME}
              name={FIELD_NAME}
              component={TitleBindPiecesList}
              props={{ toggleCheckedAll: form.mutators.toggleCheckedAll }}
            />
          </Pane>
        </Paneset>
      </HasCommand>
    </form>
  );
};

TitleBindPieces.propTypes = {
  form: PropTypes.object,
  isLoading: PropTypes.bool,
  instanceId: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  paneTitle: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  titleId: PropTypes.string,
  values: PropTypes.object.isRequired,
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
    setLocationValue: setLocationValueFormMutator,
  },
})(TitleBindPieces);
