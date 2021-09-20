/* istanbul ignore */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import faker from 'faker';
import { noop } from 'lodash';

import '@folio/stripes-acq-components/test/jest/__mock__';

import ReceivingList from './ReceivingList';

// TODO: move to stripes-acq-components mock
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useItemToView: jest.fn().mockReturnValue({}),
  useFiltersToogle: jest.fn().mockReturnValue({ isFiltersOpened: true, toggleFilters: jest.fn() }),
}));

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
}));

jest.mock('react-virtualized-auto-sizer/dist/index.cjs', () => {
  return (props) => {
    const renderCallback = props.children;

    return renderCallback({
      width: 600,
      height: 400,
    });
  };
});

jest.mock('./ReceivingListFilter', () => {
  return () => <span>ReceivingListFilter</span>;
});

const generateTitle = () => ({
  title: `${faker.name.title()}_${(new Date()).valueOf()}`,
});

const titlesCount = 24;
const titles = [...Array(titlesCount)].map(() => generateTitle());

const renderReceivingList = () => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <ReceivingList
        isLoading={false}
        onNeedMoreData={noop}
        resetData={noop}
        titles={titles}
        titlesCount={titlesCount}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('Given Receiving List', () => {
  afterEach(cleanup);

  it('Than it should display search form', () => {
    const { getByText } = renderReceivingList();

    expect(getByText('stripes-acq-components.search')).toBeDefined();
  });

  it('Than it should display passed titles', () => {
    const { getByText } = renderReceivingList();

    titles.forEach(({ title }) => {
      expect(getByText(title)).toBeDefined();
    });
  });
});
