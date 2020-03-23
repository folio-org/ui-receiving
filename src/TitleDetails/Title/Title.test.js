import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import Title from './Title';

const renderTitle = (prop) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <Title
        title={prop.title}
        instanceId={prop.instanceId}
      />
    </MemoryRouter>
  </IntlProvider>,
));

const title = {
  title: 'Title',
  instanceId: '001',
};

describe('Given title', () => {
  afterEach(cleanup);

  it('Than it should display title', () => {
    const { getByText } = renderTitle(title);

    expect(getByText(title.title)).toBeDefined();
  });
});

describe('When title is connected with instance', () => {
  it('Than it should display title value as a link', () => {
    const { queryByTestId } = renderTitle(title);

    expect(queryByTestId('titleInstanceLink')).not.toEqual(null);
  });
});

describe('When title is not connected with instance', () => {
  it('Than it should display title value as a plain text', () => {
    const { queryByTestId } = renderTitle({ ...title, instanceId: null });

    expect(queryByTestId('titleInstanceLink')).toEqual(null);
  });
});
