import PropTypes from 'prop-types';
import { Field, useFormState } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { upperFirst } from 'lodash';

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
import {
  ACCESSION_NUMBER_SETTING,
  BARCODE_SETTING,
  CALL_NUMBER_SETTING,
  NUMBER_GENERATOR_OPTIONS,
  USE_SHARED_NUMBER,
} from '../../common/constants/numberGenerator';

const NumberGeneratorSettingsForm = ({ handleSubmit, pristine, submitting }) => {
  const { values } = useFormState();

  const disableSharedNumber =
    values?.accessionNumber === NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD ||
    values?.callNumber === NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD;
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
    <Pane defaultWidth="fill" footer={paneFooter} id="number-generator-settings-form" renderHeader={paneHeader}>
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
            id={`${BARCODE_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD)}`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setManually" values={{ number: 'barcode' }} />}
            name={BARCODE_SETTING}
            type="radio"
            value={NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD}
          />
          <Field
            component={RadioButton}
            id={`${BARCODE_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_BOTH)}`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGeneratorOrManually" values={{ number: 'barcode' }} />}
            name={BARCODE_SETTING}
            type="radio"
            value={NUMBER_GENERATOR_OPTIONS.USE_BOTH}
          />
          <Field
            component={RadioButton}
            id={`${BARCODE_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_GENERATOR)}`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGenerator" values={{ number: 'barcode' }} />}
            name={BARCODE_SETTING}
            type="radio"
            value={NUMBER_GENERATOR_OPTIONS.USE_GENERATOR}
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
            id={`${ACCESSION_NUMBER_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD)}`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setManually" values={{ number: 'accession number' }} />}
            name={ACCESSION_NUMBER_SETTING}
            type="radio"
            value={NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD}
          />
          <Field
            component={RadioButton}
            id={`${ACCESSION_NUMBER_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_BOTH)}`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGeneratorOrManually" values={{ number: 'accession number' }} />}
            name={ACCESSION_NUMBER_SETTING}
            type="radio"
            value={NUMBER_GENERATOR_OPTIONS.USE_BOTH}
          />
          <Field
            component={RadioButton}
            id={`${ACCESSION_NUMBER_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_GENERATOR)}`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGenerator" values={{ number: 'accession number' }} />}
            name={ACCESSION_NUMBER_SETTING}
            type="radio"
            value={NUMBER_GENERATOR_OPTIONS.USE_GENERATOR}
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
            id={`${CALL_NUMBER_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD)}`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setManually" values={{ number: 'call number' }} />}
            name={CALL_NUMBER_SETTING}
            type="radio"
            value={NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD}
          />
          <Field
            component={RadioButton}
            id={`${CALL_NUMBER_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_BOTH)}`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGeneratorOrManually" values={{ number: 'call number' }} />}
            name={CALL_NUMBER_SETTING}
            type="radio"
            value={NUMBER_GENERATOR_OPTIONS.USE_BOTH}
          />
          <Field
            component={RadioButton}
            id={`${CALL_NUMBER_SETTING}${upperFirst(NUMBER_GENERATOR_OPTIONS.USE_GENERATOR)}`}
            label={<FormattedMessage id="ui-receiving.settings.numberGenerator.setGenerator" values={{ number: 'call number' }} />}
            name={CALL_NUMBER_SETTING}
            type="radio"
            value={NUMBER_GENERATOR_OPTIONS.USE_GENERATOR}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            component={Checkbox}
            disabled={disableSharedNumber}
            id={USE_SHARED_NUMBER}
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
