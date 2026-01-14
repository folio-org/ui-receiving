import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  NumberGeneratorSelector,
  useGenerateNumber,
} from '@folio/service-interaction';
import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import {
  ACCESSION_NUMBER_GENERATOR_CODE,
  BARCODE_GENERATOR_CODE,
  CALL_NUMBER_GENERATOR_CODE,
  USE_ACCESSION_NUMBER_FOR_CALL_NUMBER,
} from '../../constants';

const NumberGeneratorModal = ({
  numberGeneratorData,
  modalLabel,
  onClose,
  onGenerateAccessionNumber,
  onGenerateBarcode,
  onGenerateCallNumber,
  open,
}) => {
  const [selectedAccessionNumberSequence, setSelectedAccessionNumberSequence] = useState();
  const [selectedBarcodeSequence, setSelectedBarcodeSequence] = useState();
  const [selectedCallNumberSequence, setSelectedCallNumberSequence] = useState();

  // In the case of "useAccessionNumberForCallNumber" this should do both callbacks
  const accessionNumberCallback = (val) => {
    if (numberGeneratorData[USE_ACCESSION_NUMBER_FOR_CALL_NUMBER]) {
      onGenerateAccessionNumber(val);
      onGenerateCallNumber(val);
    } else {
      onGenerateAccessionNumber(val);
    }
  };

  const { generate: generateAccessionNumber } = useGenerateNumber({
    callback: accessionNumberCallback,
    generator: ACCESSION_NUMBER_GENERATOR_CODE,
    sequence: selectedAccessionNumberSequence?.code,
  });

  const { generate: generateBarcode } = useGenerateNumber({
    callback: onGenerateBarcode,
    generator: BARCODE_GENERATOR_CODE,
    sequence: selectedBarcodeSequence?.code,
  });

  const { generate: generateCallNumber } = useGenerateNumber({
    callback: onGenerateCallNumber,
    generator: CALL_NUMBER_GENERATOR_CODE,
    sequence: selectedCallNumberSequence?.code,
  });

  const generateNumbers = () => {
    // Only generate the numbers which have a selected sequence
    if (selectedAccessionNumberSequence) {
      generateAccessionNumber();
      setSelectedAccessionNumberSequence();
    }

    if (selectedBarcodeSequence) {
      generateBarcode();
      setSelectedBarcodeSequence();
    }

    if (selectedCallNumberSequence) {
      generateCallNumber();
      setSelectedCallNumberSequence();
    }
  };

  const renderAccessionAndCallNumberSelectors = () => {
    if (numberGeneratorData[USE_ACCESSION_NUMBER_FOR_CALL_NUMBER]) {
      return (
        <NumberGeneratorSelector
          displayClearItem
          generator={ACCESSION_NUMBER_GENERATOR_CODE}
          id={`${ACCESSION_NUMBER_GENERATOR_CODE}-selector`}
          label={<FormattedMessage id="ui-receiving.numberGenerator.accessionAndCallNumberSequence" />}
          onSequenceChange={seq => setSelectedAccessionNumberSequence(seq)}
          selectFirstSequenceOnMount={false}
        />
      );
    }

    return (
      <>
        {(
          numberGeneratorData.accessionNumber === 'onNotEditable' ||
          numberGeneratorData.accessionNumber === 'onEditable'
        ) &&
          <NumberGeneratorSelector
            displayClearItem
            generator={ACCESSION_NUMBER_GENERATOR_CODE}
            id={`${ACCESSION_NUMBER_GENERATOR_CODE}-selector`}
            label={<FormattedMessage id="ui-receiving.numberGenerator.accessionNumberSequence" />}
            onSequenceChange={seq => setSelectedAccessionNumberSequence(seq)}
            selectFirstSequenceOnMount={false}
          />
        }
        {(
          numberGeneratorData.callNumber === 'onNotEditable' ||
          numberGeneratorData.callNumber === 'onEditable'
        ) &&
          <NumberGeneratorSelector
            displayClearItem
            generator={CALL_NUMBER_GENERATOR_CODE}
            id={`${CALL_NUMBER_GENERATOR_CODE}-selector`}
            label={<FormattedMessage id="ui-receiving.numberGenerator.callNumberSequence" />}
            onSequenceChange={seq => setSelectedCallNumberSequence(seq)}
            selectFirstSequenceOnMount={false}
          />
        }
      </>
    );
  };

  return (
    <Modal
      // Necessary since typedown uses overlays
      enforceFocus={false}
      footer={
        <ModalFooter>
          <Button
            buttonStyle="primary"
            disabled={
              !selectedAccessionNumberSequence &&
              !selectedBarcodeSequence &&
              !selectedCallNumberSequence
            }
            marginBottom0
            onClick={() => {
              generateNumbers();
              onClose();
            }}
          >
            <FormattedMessage id="ui-receiving.numberGenerator.generateNumbers" />
          </Button>
          <Button
            marginBottom0
            onClick={onClose}
          >
            <FormattedMessage id="ui-service-interaction.cancel" />
          </Button>
        </ModalFooter>
      }
      label={modalLabel}
      onClose={onClose}
      open={open}
    >
      <FormattedMessage id="ui-receiving.numberGenerator.generateHelpText" />
      {(
        numberGeneratorData.barcode === 'onNotEditable' ||
        numberGeneratorData.barcode === 'onEditable'
      ) &&
        <NumberGeneratorSelector
          displayClearItem
          generator={BARCODE_GENERATOR_CODE}
          id={`${BARCODE_GENERATOR_CODE}-selector`}
          label={<FormattedMessage id="ui-receiving.numberGenerator.barcodeSequence" />}
          onSequenceChange={seq => setSelectedBarcodeSequence(seq)}
          selectFirstSequenceOnMount={false}
        />
      }
      {renderAccessionAndCallNumberSelectors()}
    </Modal>
  );
};

NumberGeneratorModal.propTypes = {
  numberGeneratorData: PropTypes.shape({
    accessionNumber: PropTypes.string,
    barcode: PropTypes.string,
    callNumber: PropTypes.string,
    useSharedNumber: PropTypes.bool,
  }).isRequired,
  modalLabel: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  onGenerateAccessionNumber: PropTypes.func.isRequired,
  onGenerateBarcode: PropTypes.func.isRequired,
  onGenerateCallNumber: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default NumberGeneratorModal;
