import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';

import { SequenceNumberField } from './SequenceNumberField';

const defaultProps = {
  isEditMode: false,
  nextSequenceNumber: 42,
};

const Form = stripesFinalForm({})(({ children }) => <form>{children}</form>);
const renderSequenceNumberField = (props = {}) => {
  return render(
    <Form onSubmit={jest.fn()}>
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

  it('should render sequence number field', async () => {
    renderSequenceNumberField();

    await act(async () => {
      await userEvent.type(screen.getByRole('spinbutton', { name: 'ui-receiving.piece.sequence' }), '100');
    });

    expect(screen.getByRole('spinbutton', { name: 'ui-receiving.piece.sequence' })).toHaveValue(100);
  });
});
