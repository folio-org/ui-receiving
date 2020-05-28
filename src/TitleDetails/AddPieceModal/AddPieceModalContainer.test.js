import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import '@folio/stripes-acq-components/test/jest/__mock__';

import AddPieceModalContainer from './AddPieceModalContainer';

const renderAddPieceModalContainer = (close, onSubmit, initialValues, instanceId, onCheckIn, poLine) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <AddPieceModalContainer
        close={close}
        initialValues={initialValues}
        instanceId={instanceId}
        onCheckIn={onCheckIn}
        onSubmit={onSubmit}
        poLine={poLine}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('AddPieceModalContainer', () => {
  let close;
  let onSubmit;
  let onCheckIn;

  beforeEach(() => {
    close = jest.fn();
    onSubmit = jest.fn();
    onCheckIn = jest.fn();
  });

  afterEach(cleanup);

  it('should display Add Piece form', () => {
    const poLine = { id: 'poLineId', physical: { createInventory: 'None' } };
    const initialValues = { caption: 'testcaption', format: 'Physical', id: 'id', poLineId: 'poLineId', titleId: 'titleId' };
    const { getByLabelText, getByText } = renderAddPieceModalContainer(close, onSubmit, initialValues, 'instanceId', onCheckIn, poLine);

    // header is rendered
    expect(getByText('ui-receiving.piece.caption')).toBeDefined();
    expect(getByLabelText('ui-receiving.piece.caption')).toBeDefined();
    expect(getByText('ui-receiving.piece.format')).toBeDefined();
    expect(getByText('ui-receiving.piece.receiptDate')).toBeDefined();
    fireEvent.input(getByLabelText('ui-receiving.piece.caption'));
  });
});
