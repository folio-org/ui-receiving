import {
  render,
  cleanup,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import { usePaginatedPieces } from '../../common/hooks';
import { BoundPiecesList } from './BoundPiecesList';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  TextLink: jest.fn().mockImplementation(({ children, to }) => <a href={to} data-testid="textLink">{children}</a>),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn().mockReturnValue({ hasPerm: jest.fn().mockReturnValue(true) }),
}));
jest.mock('../../common/hooks', () => ({
  usePaginatedPieces: jest.fn(),
}));

const pieces = [{
  barcode: 'v1',
  isBound: true,
  displaySummary: 'Electronic item',
  status: { name: 'Available' },
}];

const renderBoundPiecesList = (props = {}) => (render(
  <IntlProvider locale="en">
    <BoundPiecesList
      id="boundPiecesListId"
      filters={{}}
      title={{ id: 'titleId' }}
      {...props}
    />
  </IntlProvider>,
));

describe('BoundPiecesList', () => {
  beforeEach(() => {
    usePaginatedPieces.mockClear().mockReturnValue({
      pieces,
      totalCount: pieces.length,
      isFetching: false,
    });
  });

  afterEach(cleanup);

  it('should render component', () => {
    renderBoundPiecesList();

    expect(screen.getByText('ui-receiving.piece.callNumber')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.displaySummary')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.barcode')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.status')).toBeInTheDocument();

    expect(screen.getByText(pieces[0].barcode)).toBeInTheDocument();
  });

  it('should render barcode link', () => {
    usePaginatedPieces.mockClear().mockReturnValue({
      pieces: [{
        ...pieces[0],
        itemId: 'itemId',
        holdingsRecordId: 'holdingsRecordId',
      }],
      totalCount: pieces.length,
      isFetching: false,
    });

    renderBoundPiecesList({ title: { instanceId: 'instanceId' } });

    expect(screen.getByText('ui-receiving.piece.barcode')).toBeInTheDocument();
    expect(screen.getByTestId('textLink')).toBeInTheDocument();

    expect(screen.getByText(pieces[0].barcode)).toBeInTheDocument();
  });

  it('should not render component when pieces are not fetched', () => {
    usePaginatedPieces.mockReturnValue({
      pieces: null,
      totalCount: 0,
      isFetching: false,
    });

    renderBoundPiecesList();

    expect(screen.queryByText('ui-receiving.piece.displaySummary')).not.toBeInTheDocument();
  });
});
