import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import { BoundItemsList } from './BoundItemsList';
import { useBoundItems } from './hooks';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  TextLink: jest.fn().mockImplementation(({ children, to }) => <a href={to} data-testid="textLink">{children}</a>),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn().mockReturnValue({ hasPerm: jest.fn().mockReturnValue(true) }),
}));
jest.mock('./hooks', () => ({
  useBoundItems: jest.fn(),
}));

const items = [{
  barcode: 'v1',
  isBound: true,
  displaySummary: 'Electronic item',
  status: { name: 'Available' },
}];

const renderBoundItemsList = (props = {}) => (render(
  <IntlProvider locale="en">
    <BoundItemsList
      id="BoundItemsListId"
      filters={{}}
      title={{ id: 'titleId' }}
      {...props}
    />
  </IntlProvider>,
));

describe('BoundItemsList', () => {
  beforeEach(() => {
    useBoundItems.mockClear().mockReturnValue({
      items,
      isFetching: false,
      totalRecords: items.length,
    });
  });

  it('should render component', () => {
    renderBoundItemsList();

    expect(screen.getByText('ui-receiving.piece.callNumber')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.displaySummary')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.barcode')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.status')).toBeInTheDocument();

    expect(screen.getByText(items[0].barcode)).toBeInTheDocument();
  });

  it('should render barcode link', () => {
    useBoundItems.mockClear().mockReturnValue({
      items: [{
        ...items[0],
        id: 'id',
        itemId: 'itemId',
        holdingsRecordId: 'holdingsRecordId',
      }],
      isFetching: false,
      totalRecords: items.length,
    });

    renderBoundItemsList({ title: { instanceId: 'instanceId' } });

    expect(screen.getByText('ui-receiving.piece.barcode')).toBeInTheDocument();
    expect(screen.getByTestId('textLink')).toBeInTheDocument();

    expect(screen.getByText(items[0].barcode)).toBeInTheDocument();
  });

  it('should not render component when pieces are not fetched', () => {
    useBoundItems.mockReturnValue({
      items: [],
      isFetching: false,
      totalRecords: 0,
    });

    renderBoundItemsList();

    expect(screen.queryByText('ui-receiving.piece.displaySummary')).not.toBeInTheDocument();
  });
});
