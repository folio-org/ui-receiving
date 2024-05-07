import { useMemo, useState } from 'react';

import PropTypes from 'prop-types';
import { Field, useForm, useFormState } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  InfoPopover,
  KeyValue,
  Row,
  TextField,
} from '@folio/stripes/components';
import { getItemStatusLabel } from '@folio/stripes-acq-components';
import { useConfigurationQuery } from '../../../common/hooks';
import { ACCESSION_NUMBER_SETTING, BARCODE_SETTING, CALL_NUMBER_SETTING, NUM_GEN_CONFIG_SETTING, USE_BOTH, USE_GENERATOR } from '../../../common/constants';
import { NumberGeneratorButton, NumberGeneratorModal } from '../../../common/components';

export const ItemFields = ({ disabled }) => {
  const { values } = useFormState();
  const { change } = useForm();
  const { configs } = useConfigurationQuery(NUM_GEN_CONFIG_SETTING);

  const barcodeFieldDisabled = useMemo(() => {
    return disabled || configs[BARCODE_SETTING] === USE_GENERATOR;
  }, [configs, disabled]);

  const callNumberFieldDisabled = useMemo(() => {
    return disabled || configs[CALL_NUMBER_SETTING] === USE_GENERATOR;
  }, [configs, disabled]);

  const accessionNumberFieldDisabled = useMemo(() => {
    return disabled || configs[ACCESSION_NUMBER_SETTING] === USE_GENERATOR;
  }, [configs, disabled]);

  const [openGenerateModal, setOpenGenerateModal] = useState(false);

  return (
    <>
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <Field
            name="barcode"
            component={TextField}
            label={<FormattedMessage id="ui-receiving.piece.barcode" />}
            disabled={barcodeFieldDisabled}
            fullWidth
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <Field
            name="callNumber"
            component={TextField}
            label={<FormattedMessage id="ui-receiving.piece.callNumber" />}
            disabled={callNumberFieldDisabled}
            fullWidth
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <Field
            name="accessionNumber"
            component={TextField}
            label={<FormattedMessage id="ui-receiving.piece.accessionNumber" />}
            disabled={accessionNumberFieldDisabled}
            fullWidth
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.numberGenerator.generateNumbers" />}
            value={
              <NumberGeneratorButton
                disabled={
                  disabled || (
                    configs[BARCODE_SETTING] !== USE_GENERATOR &&
                    configs[BARCODE_SETTING] !== USE_BOTH &&
                    configs[ACCESSION_NUMBER_SETTING] !== USE_GENERATOR &&
                    configs[ACCESSION_NUMBER_SETTING] !== USE_BOTH &&
                    configs[CALL_NUMBER_SETTING] !== USE_GENERATOR &&
                    configs[CALL_NUMBER_SETTING] !== USE_BOTH
                  )
                }
                onClick={() => setOpenGenerateModal(true)}
                tooltipId="generate-numbers-btn"
                tooltipLabel={
                  <FormattedMessage id="ui-receiving.numberGenerator.generateNumbers" />
                }
              />
            }
          />
        </Col>
      </Row>
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <KeyValue
            label={(
              <>
                <FormattedMessage id="ui-receiving.piece.itemStatus" />
                <InfoPopover content={(<FormattedMessage id="ui-receiving.piece.itemStatus.info" />)} />
              </>
          )}
            value={getItemStatusLabel(values.itemStatus)}
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.piece.request" />}
            value={values.request ? <FormattedMessage id="ui-receiving.piece.request.isOpened" /> : null}
          />
        </Col>
      </Row>
      <NumberGeneratorModal
        configs={configs}
        modalLabel={<FormattedMessage id="ui-receiving.numberGenerator.generateNumbers" />}
        open={openGenerateModal}
        onClose={() => setOpenGenerateModal(false)}
        onGenerateAccessionNumber={val => {
          change('accessionNumber', val);
        }}
        onGenerateBarcode={val => {
          change('barcode', val);
        }}
        onGenerateCallNumber={val => {
          change('callNumber', val);
        }}
      />
    </>
  );
};

ItemFields.propTypes = {
  disabled: PropTypes.bool,
};
