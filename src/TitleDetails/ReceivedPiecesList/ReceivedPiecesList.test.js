import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import ReceivedPiecesList from './ReceivedPiecesList';

const title = 'ABA Journal';
const pieces = [{
  caption: 'ABA',
  format: 'Physical',
  receivedDate: '2020-02-06',
}];

const renderPiecesList = (onUnreceivePiece) => (render(
  <IntlProvider locale="en">
    <ReceivedPiecesList
      pieces={pieces}
      title={title}
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
    expect(getByText('ui-receiving.piece.title')).toBeDefined();
    expect(getByText('ui-receiving.piece.caption')).toBeDefined();
    expect(getByText('ui-receiving.piece.format')).toBeDefined();
    expect(getByText('ui-receiving.piece.receivedDate')).toBeDefined();

    // piece item is rendered
    expect(getByText(title)).toBeDefined();
    expect(getByText(pieces[0].caption)).toBeDefined();
    expect(getByText(pieces[0].format)).toBeDefined();
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
