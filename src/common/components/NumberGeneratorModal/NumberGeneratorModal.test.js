import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { Button as MockButton } from '@folio/stripes/components';

import NumberGeneratorModal from './NumberGeneratorModal';

const callback = jest.fn();
const mockOnClick = jest.fn();

const mockOnClose = jest.fn();
const mockOnGenerateAccessionNumber = jest.fn();
const mockOnGenerateBarcode = jest.fn();
const mockOnGenerateCallNumber = jest.fn();

const mockGenerate = jest.fn(() => {
  return jest.fn(() => {
    callback();
  });
});

jest.mock('@folio/service-interaction', () => {
  const mockUseGenerateNumber = jest.fn(() => ({
    generate: mockGenerate,
  }));

  const numberGenerator1 = {
    id: 'number-generator-1',
    code: 'numberGen1',
    name: 'Number generator 1',
    sequences: [
      {
        id: 'ng1-seq1',
        code: 'seq1.1',
        description: 'this is a description',
        name: 'sequence 1.1',
        nextValue: 1,
        outputTemplate: 'sequence-1.1-1-2',
        owner: {
          id: 'number-generator-1',
        },
        enabled: true,
      },
    ],
  };

  return {
    NumberGeneratorSelector: ({ onSequenceChange, label }) => (
      <div>
        {label || 'NumberGeneratorSelector'}
        <MockButton
          onClick={() => onSequenceChange(numberGenerator1.sequences[0])}
        >
          ChangeSelector
        </MockButton>
      </div>
    ),
    useGenerateNumber: mockUseGenerateNumber,
  };
});

jest.mock('../NumberGeneratorButton', () => ({ callback: callbackProp, sequence }) => (
  <MockButton
    disabled={sequence === ''}
    onClick={() => {
      mockOnClick();
      callbackProp();
    }}
  >
    NumberGeneratorButton
  </MockButton>
));

const NumberGeneratorModalProps = {
  callback,
  generator: 'numberGen1',
  id: 'test',
  label: 'test label',
  modalLabel: 'Number Generator',
  open: true,
  onClose: mockOnClose,
  onGenerateAccessionNumber: mockOnGenerateAccessionNumber,
  onGenerateBarcode: mockOnGenerateBarcode,
  onGenerateCallNumber: mockOnGenerateCallNumber,
};

const renderNumberGeneratorModal = (numberGeneratorData) => {
  render(
    <NumberGeneratorModal
      {...NumberGeneratorModalProps}
      numberGeneratorData={numberGeneratorData}
    />,
  );
};

describe('Render NumberGeneratorModal', () => {
  it('should render modal with label and help text', () => {
    renderNumberGeneratorModal({
      accessionNumber: 'onEditable',
      barcode: 'onEditable',
      callNumber: 'onEditable',
      useSharedNumber: false,
    });

    expect(screen.getByText('ui-receiving.numberGenerator.generateNumbers')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.numberGenerator.generateHelpText')).toBeInTheDocument();
  });

  it('should show all fields if values are "onEditable"', () => {
    renderNumberGeneratorModal({
      accessionNumber: 'onEditable',
      barcode: 'onEditable',
      callNumber: 'onEditable',
      useSharedNumber: false,
    });

    expect(screen.getByText('ui-receiving.numberGenerator.accessionNumberSequence')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.numberGenerator.barcodeSequence')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.numberGenerator.callNumberSequence')).toBeInTheDocument();
  });

  it('should show all fields if values are "onNotEditable"', () => {
    renderNumberGeneratorModal({
      accessionNumber: 'onNotEditable',
      barcode: 'onNotEditable',
      callNumber: 'onNotEditable',
      useSharedNumber: false,
    });

    expect(screen.getByText('ui-receiving.numberGenerator.accessionNumberSequence')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.numberGenerator.barcodeSequence')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.numberGenerator.callNumberSequence')).toBeInTheDocument();
  });

  it('should not show accessionNumber if its value is "off"', () => {
    renderNumberGeneratorModal({
      accessionNumber: 'off',
      barcode: 'onEditable',
      callNumber: 'onEditable',
      useSharedNumber: false,
    });

    expect(screen.queryByText('ui-receiving.numberGenerator.accessionNumberSequence')).not.toBeInTheDocument();
    expect(screen.getByText('ui-receiving.numberGenerator.barcodeSequence')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.numberGenerator.callNumberSequence')).toBeInTheDocument();
  });

  it('should not show barcode if its value is "off"', () => {
    renderNumberGeneratorModal({
      accessionNumber: 'onEditable',
      barcode: 'off',
      callNumber: 'onEditable',
      useSharedNumber: false,
    });

    expect(screen.getByText('ui-receiving.numberGenerator.accessionNumberSequence')).toBeInTheDocument();
    expect(screen.queryByText('ui-receiving.numberGenerator.barcodeSequence')).not.toBeInTheDocument();
    expect(screen.getByText('ui-receiving.numberGenerator.callNumberSequence')).toBeInTheDocument();
  });

  it('should not show callNumber if its value is "off"', () => {
    renderNumberGeneratorModal({
      accessionNumber: 'onEditable',
      barcode: 'onEditable',
      callNumber: 'off',
      useSharedNumber: false,
    });

    expect(screen.getByText('ui-receiving.numberGenerator.accessionNumberSequence')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.numberGenerator.barcodeSequence')).toBeInTheDocument();
    expect(screen.queryByText('ui-receiving.numberGenerator.callNumberSequence')).not.toBeInTheDocument();
  });

  it('should show one field for callNumber and accessionNumber together if useSharedNumber is "true"', () => {
    renderNumberGeneratorModal({
      accessionNumber: 'onEditable',
      barcode: 'onEditable',
      callNumber: 'onEditable',
      useSharedNumber: true,
    });

    expect(screen.getByText('ui-receiving.numberGenerator.accessionAndCallNumberSequence')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.numberGenerator.barcodeSequence')).toBeInTheDocument();
    expect(screen.queryByText('ui-receiving.numberGenerator.accessionNumberSequence')).not.toBeInTheDocument();
    expect(screen.queryByText('ui-receiving.numberGenerator.callNumberSequence')).not.toBeInTheDocument();
  });

  it('should call generateAccessionNumber when the sequence is selected', async () => {
    callback.mockClear();
    mockOnClick.mockClear();
    const mockNumberGeneratorData = {
      accessionNumber: 'onEditable',
      barcode: 'off',
      callNumber: 'off',
      useSharedNumber: false,
    };

    renderNumberGeneratorModal(mockNumberGeneratorData);

    user.click(screen.getByText('ChangeSelector'));

    user.click(screen.getByText('ui-receiving.numberGenerator.generateNumbers'));

    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalled();
    });
  });
});
