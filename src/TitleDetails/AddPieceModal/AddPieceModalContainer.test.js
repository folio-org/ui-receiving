import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import user from '@testing-library/user-event';
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

const defaultProps = {
  close: jest.fn(),
  onSubmit: jest.fn(),
  onCheckIn: jest.fn(),
  deletePiece: jest.fn(),
  poLine: { id: 'poLineId', physical: { createInventory: 'None' }, locations: [{ locationId: '001' }] },
  initialValues: { enumeration: 'testenumeration', format: 'Physical', id: 'id', poLineId: 'poLineId', titleId: 'titleId', locationId: '001' },
  locations: [{ name: 'Location', code: 'code', id: '001' }],
  locationIds: ['001'],
};

const renderAddPieceModalContainer = (props = {}) => render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <AddPieceModalContainer
        {...defaultProps}
        {...props}
      />
    </MemoryRouter>
  </IntlProvider>,
);

describe('AddPieceModalContainer', () => {
  it('should display Edit Piece form', () => {
    const { getByLabelText, getByText, queryByText } = renderAddPieceModalContainer();

    // header is rendered
    expect(getByText('ui-receiving.piece.caption')).toBeDefined();
    expect(getByLabelText('ui-receiving.piece.caption')).toBeDefined();
    expect(getByText('ui-receiving.piece.copyNumber')).toBeDefined();
    expect(getByLabelText('ui-receiving.piece.copyNumber')).toBeDefined();
    expect(getByText('ui-receiving.piece.enumeration')).toBeDefined();
    expect(getByLabelText('ui-receiving.piece.enumeration')).toBeDefined();
    expect(getByText('ui-receiving.piece.format')).toBeDefined();
    expect(getByText('ui-receiving.piece.receiptDate')).toBeDefined();
    expect(queryByText('ui-receiving.piece.actions.quickReceive')).toBeTruthy();
    fireEvent.input(getByLabelText('ui-receiving.piece.enumeration'));
  });

  it('should display Edit Received Piece form', () => {
    const { getByLabelText, queryByText, getByText } = renderAddPieceModalContainer({
      instanceId: 'instanceId',
      initialValues: {
        ...defaultProps.initialValues,
        receivingStatus: PIECE_STATUS.received,
      },
    });

    expect(getByLabelText('ui-receiving.piece.caption').disabled).toBeFalsy();
    expect(getByLabelText('ui-receiving.piece.copyNumber').disabled).toBeFalsy();
    expect(getByLabelText('ui-receiving.piece.enumeration').disabled).toBeFalsy();
    expect(getByText('stripes-acq-components.piece.pieceFormat.physical')).toBeDefined();
    expect(getByLabelText('ui-receiving.piece.receiptDate').disabled).toBeFalsy();
    expect(queryByText('ui-receiving.piece.actions.quickReceive')).toBeFalsy();
  });

  it('should call on submit when \'Save\' button was clicked', async () => {
    renderAddPieceModalContainer();

    const saveBtn = await screen.findByRole('button', {
      name: 'ui-receiving.piece.actions.save',
    });

    user.click(saveBtn);
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
});
