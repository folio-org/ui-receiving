import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import TitleInformation from './TitleInformation';

const renderTitleInformation = (titleProp) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <TitleInformation
        contributors={titleProp.contributors}
        edition={titleProp.edition}
        instanceId={titleProp.instanceId}
        poLineId={titleProp.poLineId}
        poLineNumber={titleProp.poLineNumber}
        productIds={titleProp.productIds}
        publishedDate={titleProp.publishedDate}
        publisher={titleProp.publisher}
        receiptDate={titleProp.receiptDate}
        receivingNote={titleProp.receivingNote}
        subscriptionFrom={titleProp.subscriptionFrom}
        subscriptionInterval={titleProp.subscriptionInterval}
        subscriptionTo={titleProp.subscriptionTo}
        title={titleProp.title}
      />
    </MemoryRouter>
  </IntlProvider>,
));

const title = {
  contributors: [],
  edition: 'First edition',
  instanceId: '123',
  poLineId: '001',
  poLineNumber: 'POL-123',
  productIds: [],
  publishedDate: '1915',
  publisher: 'American Bar Association',
  receiptDate: '2021-02-06',
  receivingNote: 'critical',
  subscriptionFrom: '2020-02-07',
  subscriptionInterval: 0,
  subscriptionTo: '2021-02-07',
  title: 'ABA Journal',
};

describe('Given Title information', () => {
  afterEach(cleanup);

  it('Than it should display title values', () => {
    const { getByText } = renderTitleInformation(title);

    expect(getByText(title.edition)).toBeDefined();
    expect(getByText(title.poLineNumber)).toBeDefined();
    expect(getByText(title.publishedDate)).toBeDefined();
    expect(getByText(title.publisher)).toBeDefined();
    expect(getByText(title.receiptDate)).toBeDefined();
    expect(getByText(title.receivingNote)).toBeDefined();
    expect(getByText(title.subscriptionFrom)).toBeDefined();
    expect(getByText(title.subscriptionInterval.toString())).toBeDefined();
    expect(getByText(title.subscriptionTo)).toBeDefined();
    expect(getByText(title.title)).toBeDefined();
  });

  describe('When title is connected with instance and poLine', () => {
    it('Than it should display title value as a link', () => {
      const { queryByTestId } = renderTitleInformation(title);

      expect(queryByTestId('titleInstanceLink')).not.toEqual(null);
      expect(queryByTestId('titlePOLineLink')).not.toEqual(null);
    });
  });

  describe('When title is not connected with instance', () => {
    it('Than it should display title value as a plain text', () => {
      const { queryByTestId } = renderTitleInformation({ ...title, instanceId: null });

      expect(queryByTestId('titleInstanceLink')).toEqual(null);
    });
  });
});
