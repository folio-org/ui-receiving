import React from 'react';
import { render, cleanup, fireEvent, wait } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import '@folio/stripes-acq-components/test/jest/__mock__';

import { PIECE_STATUS } from '@folio/stripes-acq-components';
import AddPieceModalContainer from './AddPieceModalContainer';

const renderAddPieceModalContainer = (
  close,
  onSubmit,
  initialValues,
  instanceId,
  onCheckIn,
  poLine,
  mutator,
) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <AddPieceModalContainer
        close={close}
        initialValues={initialValues}
        instanceId={instanceId}
        onCheckIn={onCheckIn}
        onSubmit={onSubmit}
        poLine={poLine}
        mutator={mutator}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('AddPieceModalContainer', () => {
  let close;
  let onSubmit;
  let onCheckIn;
  let mutator;

  beforeEach(() => {
    close = jest.fn();
    onSubmit = jest.fn();
    onCheckIn = jest.fn();
    mutator = {
      locations: {
        GET: jest.fn(),
        reset: jest.fn(),
      },
    };
  });

  afterEach(cleanup);

  it('should display Edit Piece form', () => {
    const poLine = { id: 'poLineId', physical: { createInventory: 'None' }, locations: [{ locationId: '001' }] };
    const initialValues = { caption: 'testcaption', format: 'Physical', id: 'id', poLineId: 'poLineId', titleId: 'titleId', locationId: '001' };
    const pieceLocations = [{ name: 'Location', id: '001' }];

    mutator.locations.GET.mockReturnValue(Promise.resolve(pieceLocations));

    const { getByLabelText, getByText, queryByText } = renderAddPieceModalContainer(close, onSubmit, initialValues, 'instanceId', onCheckIn, poLine, mutator);

    expect(mutator.locations.GET).toHaveBeenCalled();
    // header is rendered
    wait(() => expect(getByText('ui-receiving.piece.caption')).toBeDefined());
    wait(() => expect(getByLabelText('ui-receiving.piece.caption')).toBeDefined());
    wait(() => expect(getByText('ui-receiving.piece.format')).toBeDefined());
    wait(() => expect(getByText('ui-receiving.piece.receiptDate')).toBeDefined());
    wait(() => expect(getByText(pieceLocations[0].name)).toBeDefined());
    wait(() => expect(queryByText('ui-receiving.piece.actions.quickReceive')).toBeTruthy());
    wait(() => fireEvent.input(getByLabelText('ui-receiving.piece.caption')));
  });

  it('should display Edit Received Piece form', () => {
    const poLine = { id: 'poLineId', physical: { createInventory: 'None' } };
    const piece = {
      caption: 'testcaption',
      format: 'Physical',
      id: 'id',
      locationId: '001',
      poLineId: 'poLineId',
      titleId: 'titleId',
      receivingStatus: PIECE_STATUS.received,
    };
    const pieceLocations = [{ name: 'Location', id: '001' }];

    mutator.locations.GET.mockReturnValue(Promise.resolve(pieceLocations));

    const { getByLabelText, queryByText } = renderAddPieceModalContainer(close, onSubmit, piece, 'instanceId', onCheckIn, poLine, mutator);

    wait(() => expect(getByLabelText('ui-receiving.piece.caption').disabled).toBeFalsy());
    wait(() => expect(getByLabelText('ui-receiving.piece.format').disabled).toBeTruthy());
    wait(() => expect(getByLabelText('ui-receiving.piece.receiptDate').disabled).toBeFalsy());
    wait(() => expect(queryByText('ui-receiving.piece.actions.quickReceive')).toBeFalsy());
    wait(() => expect(getByLabelText('ui-receiving.piece.location').disabled).toBeTruthy());
  });
});
