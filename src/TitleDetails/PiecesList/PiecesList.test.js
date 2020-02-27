import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import PiecesList from './PiecesList';

const pieces = [{
  caption: 'ABA',
  format: 'Physical',
  receiptDate: '2021-02-06',
  receivedDate: '2020-02-06',
  itemId: 'item1',
  barcode: 'A43GA',
  request: {
    itemId: 'item1',
  },
}];

const renderPiecesList = () => (render(
  <IntlProvider locale="en">
    <PiecesList
      pieces={pieces}
      visibleColumns={['barcode', 'caption', 'format', 'receiptDate', 'receivedDate', 'request', 'actions']}
      renderActions={() => 'Actions'}
    />
  </IntlProvider>,
));

describe('Given Pieces List', () => {
  afterEach(cleanup);

  it('Than it should display pieces table', () => {
    const { getByText } = renderPiecesList();

    // header is rendered
    expect(getByText('ui-receiving.piece.barcode')).toBeDefined();
    expect(getByText('ui-receiving.piece.caption')).toBeDefined();
    expect(getByText('ui-receiving.piece.format')).toBeDefined();
    expect(getByText('ui-receiving.piece.receiptDate')).toBeDefined();
    expect(getByText('ui-receiving.piece.receivedDate')).toBeDefined();
    expect(getByText('ui-receiving.piece.request')).toBeDefined();

    // piece item is rendered
    expect(getByText(pieces[0].barcode)).toBeDefined();
    expect(getByText(pieces[0].caption)).toBeDefined();
    expect(getByText('ui-receiving.piece.pieceFormat.physical')).toBeDefined();
    expect(getByText(pieces[0].receiptDate)).toBeDefined();
    expect(getByText(pieces[0].receivedDate)).toBeDefined();
    expect(getByText('ui-receiving.piece.request.isOpened')).toBeDefined();
    expect(getByText('Actions')).toBeDefined();
  });
});
