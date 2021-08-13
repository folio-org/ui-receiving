import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import stripesFinalForm from '@folio/stripes/final-form';

import ProductIdDetailsForm from './ProductIdDetailsForm';

// eslint-disable-next-line react/prop-types
const renderProductIdDetailsForm = ({ identifierTypes = [{ id: '1', name: 'type-1' }], disabled }) => (
  <form>
    <ProductIdDetailsForm
      identifierTypes={identifierTypes}
      disabled={disabled}
    />
  </form>
);

const FormComponent = stripesFinalForm({})(renderProductIdDetailsForm);

const renderComponent = (props = {}) => (render(
  <FormComponent
    onSubmit={() => { }}
    initialValues={{ 'productIds': [] }}
    {...props}
  />,
  { wrapper: MemoryRouter },
));

describe('ProductIdDetailsForm', () => {
  it('should render button for adding product ids', () => {
    renderComponent();

    expect(screen.getByText('ui-receiving.title.productIds.add')).toBeDefined();
  });

  it('should add product id fields', () => {
    renderComponent();

    user.click(screen.getByText('ui-receiving.title.productIds.add'));

    expect(screen.getByText('ui-receiving.title.productIds.productId')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.productIds.qualifier')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.productIds.productIdType')).toBeDefined();
  });
});
