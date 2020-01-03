/* istanbul ignore */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import faker from 'faker';
import { noop } from 'lodash';

import '@folio/stripes-acq-components/test/jest/__mock__';

import ReceivingList from './ReceivingList';

jest.mock('react-virtualized-auto-sizer/dist/index.cjs', () => {
  return (props) => {
    const renderCallback = props.children;

    return renderCallback({
      width: 600,
      height: 400,
    });
  };
});

const generateTitle = () => ({
  title: faker.name.title(),
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
