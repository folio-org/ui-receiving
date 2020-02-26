import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import ExpectedPiecesList from './ExpectedPiecesList';

const pieces = [{
  caption: 'ABA',
  format: 'Physical',
  receiptDate: '2020-02-06',
}];

const renderPiecesList = (onEditPiece, onReceivePiece) => (render(
  <IntlProvider locale="en">
    <ExpectedPiecesList
      pieces={pieces}
      onEditPiece={onEditPiece}
      onReceivePiece={onReceivePiece}
    />
  </IntlProvider>,
));

describe('Given Expected Pieces List', () => {
  let onEditPiece;
  let onReceivePiece;

  beforeEach(() => {
    onEditPiece = jest.fn();
    onReceivePiece = jest.fn();
  });

  afterEach(cleanup);

  it('Than it should display correct table', () => {
    const { getByText, getByTestId } = renderPiecesList(onEditPiece, onReceivePiece);

    // header is rendered
    expect(getByText('ui-receiving.piece.caption')).toBeDefined();
    expect(getByText('ui-receiving.piece.format')).toBeDefined();
    expect(getByText('ui-receiving.piece.receiptDate')).toBeDefined();
    expect(getByText('ui-receiving.piece.request')).toBeDefined();

    // piece item is rendered
    expect(getByText(pieces[0].caption)).toBeDefined();
    expect(getByText('ui-receiving.piece.pieceFormat.physical')).toBeDefined();
    expect(getByText(pieces[0].receiptDate)).toBeDefined();
    expect(getByTestId('expectedPieceActionMenu')).toBeDefined();
  });

  describe('When edit piece is pressed', () => {
    it('Than passed callback should be called', () => {
      const { getByTestId } = renderPiecesList(onEditPiece, onReceivePiece);

      fireEvent(getByTestId('editPiece'), new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }));

      expect(onEditPiece).toHaveBeenCalled();
    });
  });
});
