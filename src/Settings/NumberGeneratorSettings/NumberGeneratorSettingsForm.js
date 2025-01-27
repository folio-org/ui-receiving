import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Checkbox,
  Col,
  Label,
  MessageBanner,
  Pane,
  PaneFooter,
  PaneHeader,
  RadioButton,
  RadioButtonGroup,
  Row,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

const NumberGeneratorSettingsForm = ({ handleSubmit, pristine, submitting }) => {
  const paneHeader = (renderProps) => (
    <PaneHeader
      {...renderProps}
      paneTitle={<FormattedMessage id="ui-receiving.settings.numberGenerator.options" />}
    />
  );

  const paneFooter = (
    <PaneFooter
      renderEnd={
        <Button
          buttonStyle="primary mega"
          disabled={pristine || submitting}
          id="clickable-save-number-generator-settings"
          onClick={handleSubmit}
          type="submit"
        >
          <FormattedMessage id="stripes-core.button.save" />
        </Button>
      }
    />
  );

  return (
    <Pane defaultWidth="fill" footer={paneFooter} id="vendor-code-settings" renderHeader={paneHeader}>
      <Row>
        <Col xs={12}>
          <div>
            <MessageBanner>
              <p><FormattedMessage id="ui-receiving.settings.numberGenerator.info" /></p>
            </MessageBanner>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            component={RadioButtonGroup}
            name="barcode"
          >
            <Label><FormattedMessage id="ui-receiving.settings.numberGenerator.barcode" /></Label>
            <RadioButton
              label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setManually" values={{ number: 'barcode' }} />}
              type="radio"
            />
            <RadioButton
              label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGeneratorOrManually" values={{ number: 'barcode' }} />}
              type="radio"
            />
            <RadioButton
              label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGenerator" values={{ number: 'barcode' }} />}
              type="radio"
            />
          </Field>

          <Field
            component={RadioButtonGroup}
            name="accessionNumber"
          >
            <Label><FormattedMessage id="ui-receiving.settings.numberGenerator.accessionNumber" /></Label>
            <RadioButton
              label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setManually" values={{ number: 'accession number' }} />}
              type="radio"
            />
            <RadioButton
              label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGeneratorOrManually" values={{ number: 'accession number' }} />}
              type="radio"
            />
            <RadioButton
              label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGenerator" values={{ number: 'accession number' }} />}
              type="radio"
            />
          </Field>

          <Field
            component={RadioButtonGroup}
            name="callNumber"
          >
            <Label><FormattedMessage id="ui-receiving.settings.numberGenerator.callNumber" /></Label>
            <RadioButton
              label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setManually" values={{ number: 'call number' }} />}
              type="radio"
            />
            <RadioButton
              label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGeneratorOrManually" values={{ number: 'call number' }} />}
              type="radio"
            />
            <RadioButton
              label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGenerator" values={{ number: 'call number' }} />}
              type="radio"
            />
          </Field>
          <Checkbox
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.accessionNumberEqualCallNumber" />}
            checked
          />
        </Col>
      </Row>
    </Pane>
  );
};

NumberGeneratorSettingsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  subscription: { values: true },
})(NumberGeneratorSettingsForm);
