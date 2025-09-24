import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';

import { PIECE_FORM_FIELD_NAMES } from '../../../../common/constants';
import { SequenceNumberField } from './SequenceNumberField';

const defaultProps = {
  isEditMode: false,
  nextSequenceNumber: 42,
};

const Form = stripesFinalForm({})(({ children }) => <form>{children}</form>);
const renderSequenceNumberField = (props = {}) => {
  return render(
    <Form
      onSubmit={jest.fn()}
      initialValues={{ [PIECE_FORM_FIELD_NAMES.sequenceNumber]: defaultProps.nextSequenceNumber }}
    >
      <SequenceNumberField
        {...defaultProps}
        {...props}
      />
    </Form>,
    { wrapper: MemoryRouter },
  );
};

describe('SequenceNumberField', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should prevent sequence number field update', async () => {
    renderSequenceNumberField();

    expect(screen.getByRole('spinbutton', { name: 'ui-receiving.piece.sequence' })).toBeDisabled();
  });

  it('should update sequence number field', async () => {
    renderSequenceNumberField({ isEditMode: true });

    await act(async () => {
      const input = screen.getByRole('spinbutton', { name: 'ui-receiving.piece.sequence' });

      await userEvent.clear(input);
      await userEvent.type(input, '100');
    });

    expect(screen.getByRole('spinbutton', { name: 'ui-receiving.piece.sequence' })).toHaveValue(100);
  });
});
