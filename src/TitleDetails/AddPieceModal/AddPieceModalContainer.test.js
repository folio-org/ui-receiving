import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { PIECE_STATUS } from '@folio/stripes-acq-components';
import AddPieceModalContainer from './AddPieceModalContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FieldInventory: jest.fn(() => 'FieldInventory'),
}));
jest.mock('../../common/components/LineLocationsView/LineLocationsView',
  () => jest.fn().mockReturnValue('LineLocationsView'));

const renderAddPieceModalContainer = (
  close,
  onSubmit,
  initialValues,
  instanceId,
  onCheckIn,
  poLine,
  locations,
  locationIds,
) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <AddPieceModalContainer
        close={close}
        initialValues={initialValues}
        instanceId={instanceId}
        locations={locations}
        locationIds={locationIds}
        onCheckIn={onCheckIn}
        onSubmit={onSubmit}
        poLine={poLine}
        deletePiece={jest.fn}
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

  it('should display Edit Piece form', () => {
    const poLine = { id: 'poLineId', physical: { createInventory: 'None' }, locations: [{ locationId: '001' }] };
    const initialValues = { enumeration: 'testenumeration', format: 'Physical', id: 'id', poLineId: 'poLineId', titleId: 'titleId', locationId: '001' };
    const locations = [{ name: 'Location', code: 'code', id: '001' }];
    const locationIds = ['001'];

    const { getByLabelText, getByText, queryByText } = renderAddPieceModalContainer(close, onSubmit, initialValues, 'instanceId', onCheckIn, poLine, locations, locationIds);

    // header is rendered
    expect(getByText('ui-receiving.piece.enumeration')).toBeDefined();
    expect(getByLabelText('ui-receiving.piece.enumeration')).toBeDefined();
    expect(getByText('ui-receiving.piece.format')).toBeDefined();
    expect(getByText('ui-receiving.piece.receiptDate')).toBeDefined();
    expect(queryByText('ui-receiving.piece.actions.quickReceive')).toBeTruthy();
    fireEvent.input(getByLabelText('ui-receiving.piece.enumeration'));
  });

  it('should display Edit Received Piece form', () => {
    const poLine = { id: 'poLineId', physical: { createInventory: 'None' }, locations: [{ locationId: '001' }] };
    const piece = {
      enumeration: 'testenumeration',
      format: 'Physical',
      id: 'id',
      locationId: '001',
      poLineId: 'poLineId',
      titleId: 'titleId',
      receivingStatus: PIECE_STATUS.received,
    };
    const locations = [{ name: 'Location', id: '001' }];
    const locationIds = ['001'];

    const { getByLabelText, queryByText, getByText } = renderAddPieceModalContainer(
      close,
      onSubmit,
      piece,
      'instanceId',
      onCheckIn,
      poLine,
      locations,
      locationIds,
    );

    expect(getByLabelText('ui-receiving.piece.enumeration').disabled).toBeFalsy();
    expect(getByText('stripes-acq-components.piece.pieceFormat.physical')).toBeDefined();
    expect(getByLabelText('ui-receiving.piece.receiptDate').disabled).toBeFalsy();
    expect(queryByText('ui-receiving.piece.actions.quickReceive')).toBeFalsy();
  });
});
