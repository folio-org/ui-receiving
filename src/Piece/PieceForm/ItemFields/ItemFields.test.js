import { Form } from 'react-final-form';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  ACCESSION_NUMBER_SETTING,
  BARCODE_SETTING,
  CALL_NUMBER_SETTING,
  GENERATOR_ON_EDITABLE,
  GENERATOR_ON,
  GENERATOR_OFF,
} from '../../../common/constants';
import { useNumberGeneratorOptions } from '../../../common/hooks';
import { ItemFields } from './ItemFields';

jest.mock('../../../common/hooks', () => ({
  useNumberGeneratorOptions: jest.fn(),
}));

const queryClient = new QueryClient();
const renderComponent = (props = {}) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <Form
        onSubmit={jest.fn()}
        render={() => <ItemFields {...props} />}
      />
    </QueryClientProvider>,
  );
};

describe('Render ItemFields with number generator settings "on"', () => {
  beforeEach(() => {
    useNumberGeneratorOptions.mockReturnValue({
      data: {
        [BARCODE_SETTING]: GENERATOR_ON,
        [CALL_NUMBER_SETTING]: GENERATOR_ON_EDITABLE,
        [ACCESSION_NUMBER_SETTING]: GENERATOR_OFF,
      },
      isLoading: false,
      error: null,
    });
  });

  it('should render all input fields', () => {
    renderComponent();
    expect(screen.getByLabelText('ui-receiving.piece.barcode')).toBeInTheDocument();
    expect(screen.getByLabelText('ui-receiving.piece.callNumber')).toBeInTheDocument();
    expect(screen.getByLabelText('ui-receiving.piece.accessionNumber')).toBeInTheDocument();
  });

  it('should disable all fields if disabled prop is true', () => {
    renderComponent({ disabled: true });
    expect(screen.getByLabelText('ui-receiving.piece.barcode')).toBeDisabled();
    expect(screen.getByLabelText('ui-receiving.piece.callNumber')).toBeDisabled();
    expect(screen.getByLabelText('ui-receiving.piece.accessionNumber')).toBeDisabled();
  });

  it('should enabled the fields with number generator setting "onNotEditable"', () => {
    renderComponent({ disabled: false });
    expect(screen.getByLabelText('ui-receiving.piece.barcode')).toBeDisabled();
    expect(screen.getByLabelText('ui-receiving.piece.callNumber')).toBeEnabled();
    expect(screen.getByLabelText('ui-receiving.piece.accessionNumber')).toBeEnabled();
  });

  it('should enabled the generateNumbers button', async () => {
    renderComponent({
      disabled: false,
    });

    const button = screen.getByRole('button', { name: 'ui-receiving.numberGenerator.generateNumbers' });

    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });
});

describe('Render ItemFields with all number generator settings "off"', () => {
  beforeEach(() => {
    useNumberGeneratorOptions.mockReturnValue({
      data: {
        [BARCODE_SETTING]: GENERATOR_OFF,
        [CALL_NUMBER_SETTING]: GENERATOR_OFF,
        [ACCESSION_NUMBER_SETTING]: GENERATOR_OFF,
      },
      isLoading: false,
      error: null,
    });
  });

  it('should render all input fields', () => {
    renderComponent();
    expect(screen.getByLabelText('ui-receiving.piece.barcode')).toBeInTheDocument();
    expect(screen.getByLabelText('ui-receiving.piece.callNumber')).toBeInTheDocument();
    expect(screen.getByLabelText('ui-receiving.piece.accessionNumber')).toBeInTheDocument();
  });

  it('should disable the generateNumbers button', () => {
    renderComponent({
      disabled: false,
    });

    const button = screen.getByRole('button', { name: 'ui-receiving.numberGenerator.generateNumbers' });

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
