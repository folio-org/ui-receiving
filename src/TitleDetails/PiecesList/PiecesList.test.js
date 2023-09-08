import React from 'react';
import { render, cleanup, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import { PIECE_COLUMNS, RECEIVED_PIECE_VISIBLE_COLUMNS } from '../constants';
import PiecesList from './PiecesList';

const pieces = [{
  enumeration: 'v1',
  format: 'Physical',
  receiptDate: '2021-02-06',
  receivedDate: '2020-02-06',
  itemId: 'item1',
  barcode: 'A43GA',
  request: {
    itemId: 'item1',
  },
}];

const renderPiecesList = (selectPiece) => (render(
  <IntlProvider locale="en">
    <PiecesList
      pieces={pieces}
      visibleColumns={RECEIVED_PIECE_VISIBLE_COLUMNS}
      selectPiece={selectPiece}
      sortedColumn={PIECE_COLUMNS.receiptDate}
    />
  </IntlProvider>,
));

describe('Given Pieces List', () => {
  afterEach(cleanup);

  it('Than it should display pieces table', () => {
    const { getByText } = renderPiecesList();

    // header is rendered
    expect(getByText('ui-receiving.piece.barcode')).toBeDefined();
    expect(getByText('ui-receiving.piece.enumeration')).toBeDefined();
    expect(getByText('ui-receiving.piece.format')).toBeDefined();
    expect(getByText('ui-receiving.piece.receivedDate')).toBeDefined();
    expect(getByText('ui-receiving.piece.request')).toBeDefined();

    // piece item is rendered
    expect(getByText(pieces[0].barcode)).toBeDefined();
    expect(getByText(pieces[0].enumeration)).toBeDefined();
    expect(getByText('stripes-acq-components.piece.pieceFormat.physical')).toBeDefined();
    expect(getByText(pieces[0].receivedDate)).toBeDefined();
    expect(getByText('ui-receiving.piece.request.isOpened')).toBeDefined();
  });

  it('Than it should invoke selectPiece cb when row is clicked', () => {
    const selectPiece = jest.fn();
    const { getByText } = renderPiecesList(selectPiece);

    fireEvent(getByText(pieces[0].barcode), new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }));

    expect(selectPiece).toHaveBeenCalled();
  });
});
