import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import ReceivedPiecesList from './ReceivedPiecesList';

const pieces = [{
  caption: 'ABA',
  format: 'Electronic',
  receivedDate: '2020-02-06',
}];

const renderPiecesList = (onUnreceivePiece) => (render(
  <IntlProvider locale="en">
    <ReceivedPiecesList
      pieces={pieces}
      onUnreceivePiece={onUnreceivePiece}
    />
  </IntlProvider>,
));

describe('Given Received Pieces List', () => {
  let onUnreceivePiece;

  beforeEach(() => {
    onUnreceivePiece = jest.fn();
  });

  afterEach(cleanup);

  it('Than it should display correct table', () => {
    const { getByText, getByTestId } = renderPiecesList(onUnreceivePiece);

    // header is rendered
    expect(getByText('ui-receiving.piece.barcode')).toBeDefined();
    expect(getByText('ui-receiving.piece.caption')).toBeDefined();
    expect(getByText('ui-receiving.piece.format')).toBeDefined();
    expect(getByText('ui-receiving.piece.receivedDate')).toBeDefined();
    expect(getByText('ui-receiving.piece.request')).toBeDefined();

    // piece item is rendered
    expect(getByText(pieces[0].caption)).toBeDefined();
    expect(getByText('ui-receiving.piece.pieceFormat.electronic')).toBeDefined();
    expect(getByText(pieces[0].receivedDate)).toBeDefined();
    expect(getByTestId('receivedPieceActionMenu')).toBeDefined();
  });

  describe('When unreceive piece is pressed', () => {
    it('Than passed callback should be called', () => {
      const { getByTestId } = renderPiecesList(onUnreceivePiece);

      fireEvent(getByTestId('unreceivePiece'), new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }));

      expect(onUnreceivePiece).toHaveBeenCalled();
    });
  });
});
