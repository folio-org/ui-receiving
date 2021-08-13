import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';

import stripesFinalForm from '@folio/stripes/final-form';

import ContributorsForm from './ContributorsForm';

// eslint-disable-next-line react/prop-types
const renderContributorsForm = ({ contributorNameTypes = [{ id: '1', name: 'type-1' }], disabled }) => (
  <form>
    <ContributorsForm
      contributorNameTypes={contributorNameTypes}
      disabled={disabled}
    />
  </form>
);

const FormComponent = stripesFinalForm({})(renderContributorsForm);

const renderComponent = (props = {}) => (render(
  <FormComponent
    onSubmit={() => { }}
    initialValues={{ 'contributors': [] }}
    {...props}
  />,
  { wrapper: MemoryRouter },
));

describe('ContributorsForm', () => {
  it('should render button for adding contributors', () => {
    renderComponent();

    expect(screen.getByText('ui-receiving.title.contributors.add')).toBeDefined();
  });

  it('should add contributor fields', () => {
    renderComponent();

    user.click(screen.getByText('ui-receiving.title.contributors.add'));

    expect(screen.getByText('ui-receiving.title.contributors.contributor')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.contributors.contributorType')).toBeDefined();
  });
});
