import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { PIECE_STATUS } from '@folio/stripes-acq-components';

import AddPieceModalContainer from './AddPieceModalContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FieldInventory: jest.fn(() => 'FieldInventory'),
}));
jest.mock('../../common/components/LineLocationsView/LineLocationsView',
  () => jest.fn().mockReturnValue('LineLocationsView'));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useUnreceive: jest.fn().mockReturnValue({ unreceive: jest.fn(() => Promise.resolve()) }),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  usePieceStatusChangeLog: jest.fn(() => ({ data: [] })),
}));
const defaultProps = {
  close: jest.fn(),
  onSubmit: jest.fn(() => Promise.resolve({})),
  onCheckIn: jest.fn(() => Promise.resolve([{ receivingItemResults: [{ pieceId: 'pieceId' }] }])),
  deletePiece: jest.fn(),
  poLine: { id: 'poLineId', physical: { createInventory: 'None' }, locations: [{ locationId: '001' }] },
  initialValues: { enumeration: 'testenumeration', format: 'Physical', id: 'id', poLineId: 'poLineId', titleId: 'titleId', locationId: '001' },
  locations: [{ name: 'Location', code: 'code', id: '001' }],
  locationIds: ['001'],
  getPieceValues: jest.fn(() => Promise.resolve({})),
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
    const { getByLabelText, getByText } = renderAddPieceModalContainer();

    // header is rendered
    expect(getByText('ui-receiving.piece.displaySummary')).toBeDefined();
    expect(getByLabelText('ui-receiving.piece.displaySummary')).toBeDefined();
    expect(getByText('ui-receiving.piece.copyNumber')).toBeDefined();
    expect(getByLabelText('ui-receiving.piece.copyNumber')).toBeDefined();
    expect(getByText('ui-receiving.piece.enumeration')).toBeDefined();
    expect(getByLabelText('ui-receiving.piece.enumeration')).toBeDefined();
    expect(getByText('ui-receiving.piece.format')).toBeDefined();
    expect(getByText('ui-receiving.piece.receiptDate')).toBeDefined();
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

    expect(getByLabelText('ui-receiving.piece.displaySummary').disabled).toBeFalsy();
    expect(getByLabelText('ui-receiving.piece.copyNumber').disabled).toBeFalsy();
    expect(getByLabelText('ui-receiving.piece.enumeration').disabled).toBeFalsy();
    expect(getByText('stripes-acq-components.piece.pieceFormat.physical')).toBeDefined();
    expect(getByLabelText('ui-receiving.piece.receiptDate').disabled).toBeFalsy();
    expect(queryByText('ui-receiving.piece.actions.quickReceive')).toBeFalsy();
  });

  it('should call \'onSubmit\' when \'Save&Close\' button was clicked', async () => {
    renderAddPieceModalContainer();

    const saveBtn = await screen.findByRole('button', {
      name: 'ui-receiving.piece.actions.saveAndClose',
    });

    await user.click(saveBtn);
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it('should call onCheckIn when \'Quick receive\' button was clicked', async () => {
    renderAddPieceModalContainer({
      initialValues: {
        ...defaultProps.initialValues,
        isCreateAnother: true,
      },
    });

    const supplement = await screen.findByRole('checkbox', {
      name: 'ui-receiving.piece.supplement',
    });

    await user.click(supplement);

    const quickReceiveBtn = await screen.findByTestId('quickReceive');

    await user.click(quickReceiveBtn);
    expect(defaultProps.onCheckIn).toHaveBeenCalled();
  });
});
