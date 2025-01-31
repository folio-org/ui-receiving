import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import NumberGeneratorSettingsForm from './NumberGeneratorSettingsForm';
import {
  BARCODE_SETTING,
  NUMBER_GENERATOR_OPTIONS,
} from '../../common/constants/numberGenerator';

jest.mock('@folio/stripes/core', () => ({
  useStripes: jest.fn(),
}));

const onSubmitMock = jest.fn();

const renderComponent = () => render(
  <NumberGeneratorSettingsForm
    initialValues={{ [BARCODE_SETTING]: NUMBER_GENERATOR_OPTIONS.USE_BOTH }}
    onSubmit={(values) => onSubmitMock(values)}
  />,
  { wrapper: MemoryRouter },
);

describe('NumberGeneratorSettingsForm', () => {
  it('should render the component with initial values', () => {
    renderComponent();

    expect(screen.getByText('ui-receiving.settings.numberGenerator.options')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.settings.numberGenerator.info')).toBeInTheDocument();
    expect(screen.getAllByText('ui-receiving.settings.numberGenerator.setManually')).toHaveLength(3);
    expect(screen.getAllByText('ui-receiving.settings.numberGenerator.setGeneratorOrManually')).toHaveLength(3);
    expect(screen.getAllByText('ui-receiving.settings.numberGenerator.setGenerator')).toHaveLength(3);
    expect(screen.getByText('ui-receiving.settings.numberGenerator.accessionNumberEqualCallNumber')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'stripes-core.button.save' })).toBeDisabled();
  });

  it('should call onSubmit with correct values', async () => {
    renderComponent();

    const barcodeUseManually = document.getElementById('barcodeUseTextField');

    expect(barcodeUseManually).toBeInTheDocument();

    const saveButton = screen.getByRole('button', { name: 'stripes-core.button.save' });

    await userEvent.click(barcodeUseManually);
    expect(saveButton).toBeEnabled();

    await userEvent.click(saveButton);
    expect(onSubmitMock).toHaveBeenCalledWith({
      [BARCODE_SETTING]: NUMBER_GENERATOR_OPTIONS.USE_TEXT_FIELD,
    });
  });

  it('should disable useSharedNumber-checkbox and show warning if clicking callNumber or accessionNumber to use manually', async () => {
    renderComponent();

    const callNumberUseManually = document.getElementById('callNumberUseTextField');
    const callNumberUseBoth = document.getElementById('callNumberUseBoth');
    const accessionNumberUseManually = document.getElementById('accessionNumberUseTextField');
    const useSharedNumberCheckbox = document.getElementById('useSharedNumber');

    expect(callNumberUseManually).toBeInTheDocument();
    expect(callNumberUseBoth).toBeInTheDocument();
    expect(accessionNumberUseManually).toBeInTheDocument();
    expect(useSharedNumberCheckbox).toBeInTheDocument();

    await userEvent.click(callNumberUseManually);
    expect(useSharedNumberCheckbox).toHaveAttribute('disabled');

    await userEvent.click(callNumberUseBoth);
    expect(useSharedNumberCheckbox).not.toHaveAttribute('disabled');

    await userEvent.click(accessionNumberUseManually);
    expect(useSharedNumberCheckbox).toHaveAttribute('disabled');
    expect(screen.getByText('ui-receiving.settings.numberGenerator.accessionNumberEqualCallNumber.warning')).toBeInTheDocument();
  });

  it('should disable callNumber or accessionNumber to use manually if clicking useSharedNumber-checkbox', async () => {
    renderComponent();

    const callNumberUseManually = document.getElementById('callNumberUseTextField');
    const accessionNumberUseManually = document.getElementById('accessionNumberUseTextField');
    const useSharedNumberCheckbox = document.getElementById('useSharedNumber');

    expect(callNumberUseManually).toBeInTheDocument();
    expect(accessionNumberUseManually).toBeInTheDocument();
    expect(useSharedNumberCheckbox).toBeInTheDocument();

    await userEvent.click(useSharedNumberCheckbox);
    expect(callNumberUseManually).toHaveAttribute('disabled');
    expect(accessionNumberUseManually).toHaveAttribute('disabled');
  });
});
