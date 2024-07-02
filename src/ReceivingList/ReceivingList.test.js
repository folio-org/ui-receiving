/* istanbul ignore */
import faker from 'faker';
import noop from 'lodash/noop';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import { useLocalStorageFilters } from '@folio/stripes-acq-components';

import ReceivingList from './ReceivingList';

// TODO: move to stripes-acq-components mock
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useItemToView: jest.fn().mockReturnValue({}),
  useFiltersToogle: jest.fn().mockReturnValue({ isFiltersOpened: true, toggleFilters: jest.fn() }),
  useLocalStorageFilters: jest.fn(),
}));

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  // eslint-disable-next-line react/prop-types
  PersistedPaneset: (props) => <div>{props.children}</div>,
}));

jest.mock('react-virtualized-auto-sizer', () => {
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

const mockLocalStorageFilters = {
  filters: {},
  searchQuery: '',
  applyFilters: jest.fn(),
  applySearch: jest.fn(),
  changeSearch: jest.fn(),
  resetFilters: jest.fn(),
  changeIndex: jest.fn(),
  searchIndex: '',
};

const generateTitle = (idx) => ({
  title: `${faker.name.title()}_${(new Date()).valueOf()}_${idx}`,
});

const titlesCount = 24;
const titles = [...Array(titlesCount)].map((_, idx) => generateTitle(idx));

const renderReceivingList = () => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <ReceivingList
        isLoading={false}
        onNeedMoreData={noop}
        resetData={noop}
        titles={titles}
        titlesCount={titlesCount}
        filtersStorageKey="receiving"
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('Given Receiving List', () => {
  beforeEach(() => {
    useLocalStorageFilters
      .mockClear()
      .mockReturnValue(Object.values(mockLocalStorageFilters));
  });

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
