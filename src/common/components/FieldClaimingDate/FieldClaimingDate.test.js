import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import stripesFinalForm from '@folio/stripes/final-form';

import { FieldClaimingDate } from './FieldClaimingDate';

const defaultProps = {
  label: 'Label',
};

const FormComponent = stripesFinalForm({})(({ children }) => <form>{children}</form>);

const renderFieldClaimingDate = (props = {}, formProps = {}) => render(
  <FormComponent
    onSubmit={jest.fn}
    {...formProps}
  >
    <FieldClaimingDate
      {...defaultProps}
      {...props}
    />
  </FormComponent>,
  { wrapper: MemoryRouter },
);

describe('FieldClaimingDate', () => {
  it('should render field', () => {
    renderFieldClaimingDate();

    expect(screen.getByText(defaultProps.label)).toBeInTheDocument();
  });
});
