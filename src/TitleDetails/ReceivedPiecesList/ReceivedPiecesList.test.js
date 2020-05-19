import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import ReceivedPiecesList from './ReceivedPiecesList';

const pieces = [{
  caption: 'ABA',
  format: 'Electronic',
  receivedDate: '2020-02-06',
}];

const renderPiecesList = () => (render(
  <IntlProvider locale="en">
    <ReceivedPiecesList
      pieces={pieces}
    />
  </IntlProvider>,
));

describe('Given Received Pieces List', () => {
  afterEach(cleanup);

  it('Than it should display correct table', () => {
    const { getByText } = renderPiecesList();

    // header is rendered
    expect(getByText('ui-receiving.piece.barcode')).toBeDefined();
    expect(getByText('ui-receiving.piece.caption')).toBeDefined();
    expect(getByText('ui-receiving.piece.format')).toBeDefined();
    expect(getByText('ui-receiving.piece.receivedDate')).toBeDefined();
    expect(getByText('ui-receiving.piece.request')).toBeDefined();

    // piece item is rendered
    expect(getByText(pieces[0].caption)).toBeDefined();
    expect(getByText('stripes-acq-components.piece.pieceFormat.electronic')).toBeDefined();
    expect(getByText(pieces[0].receivedDate)).toBeDefined();
  });
});
