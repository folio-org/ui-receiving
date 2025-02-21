import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import NumberGeneratorModal from './NumberGeneratorModal';

const mockOnClose = jest.fn();
const mockOnGenerateAccessionNumber = jest.fn();
const mockOnGenerateBarcode = jest.fn();
const mockOnGenerateCallNumber = jest.fn();

jest.mock('@folio/service-interaction', () => {
  const mockUseGenerateNumber = jest.fn(() => ({
    generate: jest.fn(),
  }));

  return {
    NumberGeneratorSelector: ({ onSequenceChange, label }) => (
      <div>
        {label}
        <button
          type="button"
          onClick={() => onSequenceChange({ code: 'seq1' })}
        >
          ChangeSelector
        </button>
      </div>
    ),
    useGenerateNumber: mockUseGenerateNumber,
  };
});

const renderComponent = (numberGeneratorData, useAccessionForCallNumber = false) => {
  render(
    <NumberGeneratorModal
      numberGeneratorData={numberGeneratorData}
      modalLabel="Number Generator Modal"
      onClose={mockOnClose}
      onGenerateAccessionNumber={mockOnGenerateAccessionNumber}
      onGenerateBarcode={mockOnGenerateBarcode}
      onGenerateCallNumber={mockOnGenerateCallNumber}
      open
      useAccessionForCallNumber={useAccessionForCallNumber}
    />,
  );
};

describe('Render NumberGeneratorModal', () => {
  it('should render modal with label', () => {
    renderComponent({
      accessionNumber: 'onEditable',
      barcode: 'onEditable',
      callNumber: 'onEditable',
      useSharedNumber: false,
    });

    expect(screen.getByText('Number Generator Modal')).toBeInTheDocument();
  });

  it('should show all fields if values are "onEditable"', () => {
    renderComponent({
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
    renderComponent({
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
    renderComponent({
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
    renderComponent({
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
    renderComponent({
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
    renderComponent({
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
});
