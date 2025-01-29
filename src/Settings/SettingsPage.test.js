import { MemoryRouter } from 'react-router-dom';

import { screen, render } from '@folio/jest-config-stripes/testing-library/react';

import SettingsPage from './SettingsPage';

const stripesMock = {
  connect: component => component,
  hasPerm: jest.fn(() => true),
};

const defaultProps = {
  stripes: stripesMock,
  match: {
    path: 'url',
  },
  location: {
    search: '?name=test',
    pathname: '',
  },
};

const renderSettingsPage = (props) => render(
  <MemoryRouter>
    <SettingsPage {...defaultProps} {...props} />
  </MemoryRouter>,
);

describe('SettingsPage', () => {
  it('should return numberGenerator link', async () => {
    renderSettingsPage();

    expect(screen.getByText('ui-receiving.settings.numberGenerator.options')).toBeInTheDocument();
  });
});
