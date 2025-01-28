import PropTypes from 'prop-types';
import { Field, useFormState } from 'react-final-form';
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
  Row,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import css from './NumberGeneratorSettings.css';

const NumberGeneratorSettingsForm = ({ handleSubmit, pristine, submitting }) => {
  const { values } = useFormState();

  const USE_TEXT_FIELD = 'useTextField';
  const USE_GENERATOR = 'useGenerator';
  const USE_BOTH = 'useBoth';

  const ACCESSION_NUMBER_SETTING = 'accessionNumber';
  const BARCODE_SETTING = 'barcode';
  const CALL_NUMBER_SETTING = 'callNumber';

  const USE_SHARED_NUMBER = 'useSharedNumber';

  const disableSharedNumber = values?.accessionNumber === USE_TEXT_FIELD || values?.callNumber === USE_TEXT_FIELD;
  const disableGeneratorOffOption = values?.useSharedNumber;

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
      <Row className={css.marginBottomGutter}>
        <Col xs={12}>
          <MessageBanner>
            <p><FormattedMessage id="ui-receiving.settings.numberGenerator.info" /></p>
          </MessageBanner>
        </Col>
      </Row>
      <Row className={css.marginBottomGutter}>
        <Col xs={12}>
          <Label><FormattedMessage id="ui-receiving.settings.numberGenerator.barcode" /></Label>
          <Field
            component={RadioButton}
            id={`${USE_TEXT_FIELD}Barcode`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setManually" values={{ number: 'barcode' }} />}
            name={BARCODE_SETTING}
            type="radio"
            value={USE_TEXT_FIELD}
          />
          <Field
            component={RadioButton}
            id={`${USE_BOTH}Barcode`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGeneratorOrManually" values={{ number: 'barcode' }} />}
            name={BARCODE_SETTING}
            type="radio"
            value={USE_BOTH}
          />
          <Field
            component={RadioButton}
            id={`${USE_GENERATOR}Barcode`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGenerator" values={{ number: 'barcode' }} />}
            name={BARCODE_SETTING}
            type="radio"
            value={USE_GENERATOR}
          />
        </Col>
      </Row>
      <Row className={css.marginBottomGutter}>
        <Col xs={12}>
          <Label><FormattedMessage id="ui-receiving.settings.numberGenerator.accessionNumber" /></Label>
          <Field
            className={disableGeneratorOffOption ? css.greyLabel : null}
            component={RadioButton}
            disabled={disableGeneratorOffOption}
            id={`${USE_TEXT_FIELD}AccessionNumber`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setManually" values={{ number: 'accession number' }} />}
            name={ACCESSION_NUMBER_SETTING}
            type="radio"
            value={USE_TEXT_FIELD}
          />
          <Field
            component={RadioButton}
            id={`${USE_BOTH}AccessionNumber`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGeneratorOrManually" values={{ number: 'accession number' }} />}
            name={ACCESSION_NUMBER_SETTING}
            type="radio"
            value={USE_BOTH}
          />
          <Field
            component={RadioButton}
            id={`${USE_GENERATOR}AccessionNumber`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGenerator" values={{ number: 'accession number' }} />}
            name={ACCESSION_NUMBER_SETTING}
            type="radio"
            value={USE_GENERATOR}
          />
        </Col>
      </Row>
      <Row className={css.marginBottomGutter}>
        <Col xs={12}>
          <Label><FormattedMessage id="ui-receiving.settings.numberGenerator.callNumber" /></Label>
          <Field
            className={disableGeneratorOffOption ? css.greyLabel : null}
            component={RadioButton}
            disabled={disableGeneratorOffOption}
            id={`${USE_TEXT_FIELD}CallNumber`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setManually" values={{ number: 'call number' }} />}
            name={CALL_NUMBER_SETTING}
            type="radio"
            value={USE_TEXT_FIELD}
          />
          <Field
            component={RadioButton}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGeneratorOrManually" values={{ number: 'call number' }} />}
            name={CALL_NUMBER_SETTING}
            type="radio"
            value={USE_BOTH}
          />
          <Field
            component={RadioButton}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGenerator" values={{ number: 'call number' }} />}
            name={CALL_NUMBER_SETTING}
            type="radio"
            value={USE_GENERATOR}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            component={Checkbox}
            disabled={disableSharedNumber}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.accessionNumberEqualCallNumber" />}
            name={USE_SHARED_NUMBER}
            type="checkbox"
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
