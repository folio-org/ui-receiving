import PropTypes from 'prop-types';
import {
  useMemo,
  useState,
} from 'react';
import {
  Field,
  useForm,
  useFormState,
} from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  InfoPopover,
  KeyValue,
  NoValue,
  Row,
  TextField,
} from '@folio/stripes/components';
import { getItemStatusLabel } from '@folio/stripes-acq-components';

import {
  NumberGeneratorButton,
  NumberGeneratorModal,
} from '../../../common/components';
import {
  ACCESSION_NUMBER_SETTING,
  BARCODE_SETTING,
  CALL_NUMBER_SETTING,
  GENERATOR_ON_EDITABLE,
  GENERATOR_ON,
} from '../../../common/constants';
import { useNumberGeneratorOptions } from '../../../common/hooks';
import { useReceivingSearchContext } from '../../../contexts';
import { PIECE_FORM_FIELD_NAMES } from '../../constants';

export const ItemFields = ({ disabled }) => {
  const { targetTenantId } = useReceivingSearchContext();

  const { values } = useFormState();
  const { change } = useForm();

  const { data: numberGeneratorData } = useNumberGeneratorOptions({ tenantId: targetTenantId });

  const barcodeFieldDisabled = useMemo(() => {
    return disabled || numberGeneratorData[BARCODE_SETTING] === GENERATOR_ON;
  }, [numberGeneratorData, disabled]);

  const callNumberFieldDisabled = useMemo(() => {
    return disabled || numberGeneratorData[CALL_NUMBER_SETTING] === GENERATOR_ON;
  }, [numberGeneratorData, disabled]);

  const accessionNumberFieldDisabled = useMemo(() => {
    return disabled || numberGeneratorData[ACCESSION_NUMBER_SETTING] === GENERATOR_ON;
  }, [numberGeneratorData, disabled]);

  const [openGenerateModal, setOpenGenerateModal] = useState(false);

  const isNumberGeneratorOff= numberGeneratorData &&
    numberGeneratorData[BARCODE_SETTING] !== GENERATOR_ON &&
    numberGeneratorData[BARCODE_SETTING] !== GENERATOR_ON_EDITABLE &&
    numberGeneratorData[ACCESSION_NUMBER_SETTING] !== GENERATOR_ON &&
    numberGeneratorData[ACCESSION_NUMBER_SETTING] !== GENERATOR_ON_EDITABLE &&
    numberGeneratorData[CALL_NUMBER_SETTING] !== GENERATOR_ON &&
    numberGeneratorData[CALL_NUMBER_SETTING] !== GENERATOR_ON_EDITABLE;

  return (
    <>
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <Field
            name={PIECE_FORM_FIELD_NAMES.barcode}
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
            name={PIECE_FORM_FIELD_NAMES.callNumber}
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
            name={PIECE_FORM_FIELD_NAMES.accessionNumber}
            component={TextField}
            label={<FormattedMessage id="ui-receiving.piece.accessionNumber" />}
            disabled={accessionNumberFieldDisabled}
            fullWidth
          />
        </Col>
        {!isNumberGeneratorOff &&
          <Col
            xs={6}
            md={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-receiving.numberGenerator.generateNumbers" />}
              value={
                <NumberGeneratorButton
                  disabled={disabled}
                  onClick={() => setOpenGenerateModal(true)}
                  tooltipId="generate-numbers-btn"
                  tooltipLabel={<FormattedMessage id="ui-receiving.numberGenerator.generateNumbers" />}
                />
              }
            />
          </Col>
        }
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
            value={values?.itemId ? getItemStatusLabel(values.itemStatus) : <NoValue />}
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
        numberGeneratorData={numberGeneratorData}
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
