import { IntlProvider } from 'react-intl';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import { usePaginatedPieces } from '../../common/hooks';
import { RECEIVED_PIECE_VISIBLE_COLUMNS } from '../../Piece';
import ReceivedPiecesList from './ReceivedPiecesList';

jest.mock('../../common/hooks', () => ({
  usePaginatedPieces: jest.fn(),
}));

const pieces = [{
  enumeration: 'v1',
  format: 'Electronic',
  receivedDate: '2020-02-06',
}];

const renderPiecesList = () => (render(
  <IntlProvider locale="en">
    <ReceivedPiecesList
      filters={{}}
      onLoadingStatusChange={jest.fn()}
      title={{ id: 'titleId' }}
      selectPiece={jest.fn}
      visibleColumns={RECEIVED_PIECE_VISIBLE_COLUMNS}
    />
  </IntlProvider>,
));

describe('Given Received Pieces List', () => {
  beforeEach(() => {
    usePaginatedPieces.mockClear().mockReturnValue({
      pieces,
      totalCount: pieces.length,
      isFetching: false,
    });
  });

  it('Than it should display correct table', () => {
    const { getByText } = renderPiecesList();

    // header is rendered
    expect(getByText('ui-receiving.piece.copyNumber')).toBeDefined();
    expect(getByText('ui-receiving.piece.displaySummary')).toBeDefined();
    expect(getByText('ui-receiving.piece.barcode')).toBeDefined();
    expect(getByText('ui-receiving.piece.enumeration')).toBeDefined();
    expect(getByText('ui-receiving.piece.format')).toBeDefined();
    expect(getByText('ui-receiving.piece.receivedDate')).toBeDefined();
    expect(getByText('ui-receiving.piece.request')).toBeDefined();

    // piece item is rendered
    expect(getByText(pieces[0].enumeration)).toBeDefined();
    expect(getByText('stripes-acq-components.piece.pieceFormat.electronic')).toBeDefined();
    expect(getByText(pieces[0].receivedDate)).toBeDefined();
  });
});
