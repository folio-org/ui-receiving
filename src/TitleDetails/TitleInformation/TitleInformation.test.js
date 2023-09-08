import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup } from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import TitleInformation from './TitleInformation';

const renderTitleInformation = (titleProp) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <TitleInformation
        contributors={titleProp.contributors}
        edition={titleProp.edition}
        productIds={titleProp.productIds}
        publishedDate={titleProp.publishedDate}
        publisher={titleProp.publisher}
        subscriptionFrom={titleProp.subscriptionFrom}
        subscriptionInterval={titleProp.subscriptionInterval}
        subscriptionTo={titleProp.subscriptionTo}
      />
    </MemoryRouter>
  </IntlProvider>,
));

const title = {
  contributors: [],
  edition: 'First edition',
  productIds: [],
  publishedDate: '1915',
  publisher: 'American Bar Association',
  subscriptionFrom: '2020-02-07',
  subscriptionInterval: 0,
  subscriptionTo: '2021-02-07',
};

describe('Given Title information', () => {
  afterEach(cleanup);

  it('Than it should display title values', () => {
    const { getByText } = renderTitleInformation(title);

    expect(getByText(title.edition)).toBeDefined();
    expect(getByText(title.publishedDate)).toBeDefined();
    expect(getByText(title.publisher)).toBeDefined();
    expect(getByText(title.subscriptionFrom)).toBeDefined();
    expect(getByText(title.subscriptionInterval.toString())).toBeDefined();
    expect(getByText(title.subscriptionTo)).toBeDefined();
  });
});
