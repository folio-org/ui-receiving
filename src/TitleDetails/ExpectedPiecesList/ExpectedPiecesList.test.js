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

const renderPiecesList = (onEditPiece) => (render(
  <IntlProvider locale="en">
    <ExpectedPiecesList
      pieces={pieces}
      selectPiece={onEditPiece}
    />
  </IntlProvider>,
));

describe('Given Expected Pieces List', () => {
  let onEditPiece;

  beforeEach(() => {
    onEditPiece = jest.fn();
  });

  afterEach(cleanup);

  it('Than it should display correct table', () => {
    const { getByText } = renderPiecesList(onEditPiece);

    // header is rendered
    expect(getByText('ui-receiving.piece.caption')).toBeDefined();
    expect(getByText('ui-receiving.piece.format')).toBeDefined();
    expect(getByText('ui-receiving.piece.receiptDate')).toBeDefined();
    expect(getByText('ui-receiving.piece.request')).toBeDefined();

    // piece item is rendered
    expect(getByText(pieces[0].caption)).toBeDefined();
    expect(getByText('stripes-acq-components.piece.pieceFormat.physical')).toBeDefined();
    expect(getByText(pieces[0].receiptDate)).toBeDefined();
  });

  describe('When edit piece is pressed', () => {
    it('Than passed callback should be called', () => {
      const { getByText } = renderPiecesList(onEditPiece);

      fireEvent(getByText(pieces[0].caption), new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }));

      expect(onEditPiece).toHaveBeenCalled();
    });
  });
});
