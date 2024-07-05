import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import TitleInformation from './TitleInformation';

jest.mock('@folio/stripes-acq-components/lib/hooks', () => ({
  ...jest.requireActual('@folio/stripes-acq-components/lib/hooks'),
  useAcquisitionUnits: jest.fn(() => ({ acquisitionsUnits: [] })),
  useContributorNameTypes: jest.fn(() => ({ contributorNameTypes: [] })),
  useIdentifierTypes: jest.fn(() => ({ identifierTypes: [] })),
}));

const queryClient = new QueryClient();

const renderTitleInformation = (titleProp) => render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <TitleInformation
          claimingActive={titleProp.claimingActive}
          claimingInterval={titleProp.claimingInterval}
          contributors={titleProp.contributors}
          edition={titleProp.edition}
          productIds={titleProp.productIds}
          publishedDate={titleProp.publishedDate}
          publisher={titleProp.publisher}
          subscriptionFrom={titleProp.subscriptionFrom}
          subscriptionInterval={titleProp.subscriptionInterval}
          subscriptionTo={titleProp.subscriptionTo}
        />
      </QueryClientProvider>
    </MemoryRouter>
  </IntlProvider>,
);

const title = {
  claimingActive: true,
  claimingInterval: 42,
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
  it('Than it should display title values', () => {
    const { getByText } = renderTitleInformation(title);

    expect(getByText(title.edition)).toBeDefined();
    expect(getByText(title.publishedDate)).toBeDefined();
    expect(getByText(title.publisher)).toBeDefined();
    expect(getByText(title.subscriptionFrom)).toBeDefined();
    expect(getByText(title.subscriptionInterval.toString())).toBeDefined();
    expect(getByText(title.subscriptionTo)).toBeDefined();
    expect(getByText('ui-receiving.title.claimingActive')).toBeInTheDocument();
    expect(getByText(title.claimingInterval)).toBeInTheDocument();
  });
});
