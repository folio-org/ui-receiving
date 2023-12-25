import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  checkScope,
  HasCommand,
  Pane,
  PaneHeader,
  Paneset,
} from '@folio/stripes/components';
import {
  FormFooter,
  handleKeyCommand,
} from '@folio/stripes-acq-components';

import { TitleExpectList } from './TitleExpectList';

const FIELD_NAME = 'unreceivablePieces';

const TitleExpect = ({
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
      handleSubmit={handleSubmit}
      isSubmitDisabled={values[FIELD_NAME].every(({ checked }) => !checked)}
      label={<FormattedMessage id="ui-receiving.title.details.button.expect" />}
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
            id="pane-title-unreceivable-pieces-list"
            defaultWidth="fill"
            renderHeader={renderProps => (
              <PaneHeader
                {...renderProps}
                onClose={onCancel}
                paneTitle={paneTitle}
              />
            )}
            footer={paneFooter}
          >
            <FieldArray
              component={TitleExpectList}
              id="unreceivable-pieces"
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

TitleExpect.propTypes = {
  form: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  pieceLocationMap: PropTypes.object.isRequired,
  pieceHoldingMap: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  paneTitle: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
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
  },
})(TitleExpect);
