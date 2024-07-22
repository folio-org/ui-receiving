import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';

import { usePaginatedPieces } from '../../common/hooks';
import { EXPECTED_PIECE_VISIBLE_COLUMNS } from '../../Piece';
import ExpectedPiecesList from './ExpectedPiecesList';

jest.mock('../../common/hooks', () => ({
  usePaginatedPieces: jest.fn(),
}));

const pieces = [{
  enumeration: 'v1',
  format: 'Physical',
  receiptDate: '2020-02-06',
}];

const renderPiecesList = (onEditPiece) => (render(
  <IntlProvider locale="en">
    <ExpectedPiecesList
      filters={{}}
      onLoadingStatusChange={jest.fn()}
      title={{ id: 'titleId' }}
      selectPiece={onEditPiece}
      visibleColumns={EXPECTED_PIECE_VISIBLE_COLUMNS}
    />
  </IntlProvider>,
));

describe('Given Expected Pieces List', () => {
  let onEditPiece;

  beforeEach(() => {
    onEditPiece = jest.fn();

    usePaginatedPieces.mockClear().mockReturnValue({
      pieces,
      totalCount: pieces.length,
      isFetching: false,
    });
  });

  it('Than it should display correct table', () => {
    const { getByText } = renderPiecesList(onEditPiece);

    // header is rendered
    expect(getByText('ui-receiving.piece.copyNumber')).toBeDefined();
    expect(getByText('ui-receiving.piece.chronology')).toBeDefined();
    expect(getByText('ui-receiving.piece.displaySummary')).toBeDefined();
    expect(getByText('ui-receiving.piece.enumeration')).toBeDefined();
    expect(getByText('ui-receiving.piece.format')).toBeDefined();
    expect(getByText('ui-receiving.piece.receiptDate')).toBeDefined();
    expect(getByText('ui-receiving.piece.request')).toBeDefined();

    // piece item is rendered
    expect(getByText(pieces[0].enumeration)).toBeDefined();
    expect(getByText('stripes-acq-components.piece.pieceFormat.physical')).toBeDefined();
    expect(getByText(pieces[0].receiptDate)).toBeDefined();
  });

  describe('When edit piece is pressed', () => {
    it('Than passed callback should be called', () => {
      const { getByText } = renderPiecesList(onEditPiece);

      fireEvent(getByText(pieces[0].enumeration), new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }));

      expect(onEditPiece).toHaveBeenCalled();
    });
  });
});
