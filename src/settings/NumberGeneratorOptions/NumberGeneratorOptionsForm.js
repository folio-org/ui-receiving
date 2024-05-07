import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';

import { Button, Checkbox, Col, InfoPopover, Label, Layout, MessageBanner, RadioButton, Row } from '@folio/stripes/components';
import css from './NumberGeneratorOptions.css';
import {
  ACCESSION_NUMBER_SETTING,
  BARCODE_SETTING,
  CALL_NUMBER_SETTING,
  USE_ACCESSION_NUMBER_FOR_CALL_NUMBER,
  USE_BOTH,
  USE_GENERATOR,
  USE_TEXT_FIELD,
} from '../../common/constants';

const NumberGeneratorOptionsForm = () => {
  const { values } = useFormState();
  const disableUseForBothFields =
    (values?.accessionNumberGeneratorSetting ?? USE_TEXT_FIELD) === USE_TEXT_FIELD ||
    (values?.callNumberGeneratorSetting ?? USE_TEXT_FIELD) === USE_TEXT_FIELD;

  const disableAccessionNumberAndCallNumberOffOptions = !!values?.useAccessionNumberForCallNumber;

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className={css.marginBottomGutter}>
            <MessageBanner>
              <FormattedMessage id="ui-receiving.settings.numberGeneratorOptions.info" />
            </MessageBanner>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className={css.marginBottomGutter}>
            <Label>
              <FormattedMessage id="ui-receiving.piece.barcode" />
            </Label>
            <Field
              component={RadioButton}
              id={`${USE_TEXT_FIELD}Barcode`}
              label={<FormattedMessage id="ui-receiving.settings.numberGeneratorOptions.useTextFieldForBarcode" />}
              name={BARCODE_SETTING}
              type="radio"
              value={USE_TEXT_FIELD}
            />
            <Field
              component={RadioButton}
              id={`${USE_BOTH}Barcode`}
              label={<FormattedMessage id="ui-receiving.settings.numberGeneratorOptions.useBothForBarcode" />}
              name={BARCODE_SETTING}
              type="radio"
              value={USE_BOTH}
            />
            <Field
              component={RadioButton}
              id={`${USE_GENERATOR}Barcode`}
              label={<FormattedMessage id="ui-receiving.settings.numberGeneratorOptions.useGeneratorForBarcode" />}
              name={BARCODE_SETTING}
              type="radio"
              value={USE_GENERATOR}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className={css.marginBottomGutter}>
            <Label>
              <FormattedMessage id="ui-receiving.piece.accessionNumber" />
            </Label>
            <Field
              component={RadioButton}
              disabled={disableAccessionNumberAndCallNumberOffOptions}
              id={`${USE_TEXT_FIELD}AccessionNumber`}
              label={
                <div className={disableAccessionNumberAndCallNumberOffOptions ? css.greyLabel : null}>
                  <FormattedMessage id="ui-receiving.settings.numberGeneratorOptions.useTextFieldForAccessionNumber" />
                </div>
              }
              name={ACCESSION_NUMBER_SETTING}
              type="radio"
              value={USE_TEXT_FIELD}
            />
            <Field
              component={RadioButton}
              id={`${USE_BOTH}AccessionNumber`}
              label={<FormattedMessage id="ui-receiving.settings.numberGeneratorOptions.useBothForAccessionNumber" />}
              name={ACCESSION_NUMBER_SETTING}
              type="radio"
              value={USE_BOTH}
            />
            <Field
              component={RadioButton}
              id={`${USE_GENERATOR}AccessionNumber`}
              label={<FormattedMessage id="ui-receiving.settings.numberGeneratorOptions.useGeneratorForAccessionNumber" />}
              name={ACCESSION_NUMBER_SETTING}
              type="radio"
              value={USE_GENERATOR}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className={css.marginBottomGutter}>
            <Label>
              <FormattedMessage id="ui-receiving.piece.callNumber" />
            </Label>
            <Field
              className={disableAccessionNumberAndCallNumberOffOptions ? css.greyLabel : null}
              component={RadioButton}
              disabled={disableAccessionNumberAndCallNumberOffOptions}
              id={`${USE_TEXT_FIELD}CallNumber`}
              label={
                <div className={disableAccessionNumberAndCallNumberOffOptions ? css.greyLabel : null}>
                  <FormattedMessage id="ui-receiving.settings.numberGeneratorOptions.useTextFieldForCallNumber" />
                </div>
              }
              name={CALL_NUMBER_SETTING}
              type="radio"
              value={USE_TEXT_FIELD}
            />
            <Field
              component={RadioButton}
              id={`${USE_BOTH}CallNumber`}
              label={<FormattedMessage id="ui-receiving.settings.numberGeneratorOptions.useBothForCallNumber" />}
              name={CALL_NUMBER_SETTING}
              type="radio"
              value={USE_BOTH}
            />
            <Field
              component={RadioButton}
              id={`${USE_GENERATOR}CallNumber`}
              label={<FormattedMessage id="ui-receiving.settings.numberGeneratorOptions.useGeneratorForCallNumber" />}
              name={CALL_NUMBER_SETTING}
              type="radio"
              value={USE_GENERATOR}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div className={css.marginBottomGutter}>
            <Field
              disabled={disableUseForBothFields}
              component={Checkbox}
              label={
                <>
                  <div className={disableUseForBothFields ? css.greyLabel : null}>
                    <FormattedMessage id="ui-receiving.settings.numberGeneratorOptions.useAccessionNumberForCallNumber" />
                  </div>
                  <InfoPopover
                    content={
                      <Layout className="display-flex flex-direction-column flex-align-items-center flex-wrap--wrap">
                        <Layout className="padding-bottom-gutter display-flex flex-direction-column flex-align-items-center">
                          <FormattedMessage
                            id="ui-receiving.settings.numberGeneratorOptions.useAccessionNumberForCallNumberInfo"
                            values={{
                              linebreak: <br />,
                            }}
                          />
                        </Layout>
                        <Layout className="display-flex flex-direction-column flex-align-items-center">
                          <Button
                            allowAnchorClick
                            buttonStyle="primary"
                            href="https://wiki.folio.org/display/FOLIOtips/Number+generator"
                            marginBottom0
                          >
                            <FormattedMessage id="ui-receiving.settings.learnMore" />
                          </Button>
                        </Layout>
                      </Layout>
                    }
                    iconSize="medium"
                  />
                </>
              }
              name={USE_ACCESSION_NUMBER_FOR_CALL_NUMBER}
              type="checkbox"
            />
            {disableUseForBothFields &&
              <MessageBanner type="warning">
                <FormattedMessage id="ui-receiving.settings.numberGeneratorOptions.useAccessionNumberForCallNumberWarning" />
              </MessageBanner>
            }
          </div>
        </Col>
      </Row>
    </>
  );
};

export default NumberGeneratorOptionsForm;
