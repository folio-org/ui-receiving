import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import {
  INVENTORY_RECORDS_TYPE,
} from '@folio/stripes-acq-components';

import AddPieceModal from './AddPieceModal';

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    FieldInventory: jest.fn().mockReturnValue('FieldInventory'),
  };
});
jest.mock('../../common/components/LineLocationsView/LineLocationsView',
  () => jest.fn().mockReturnValue('LineLocationsView'));

const defaultProps = {
  close: jest.fn(),
  createInventoryValues: {},
  deletePiece: jest.fn(),
  form: {
    getState: jest.fn().mockReturnValue({
      values: {
        holdingId: 'holding',
      },
    }),
  },
  onSubmit: jest.fn(),
  hasValidationErrors: false,
  instanceId: 'instanceId',
  isManuallyAddPieces: true,
  locationIds: [],
  locations: [{ id: '001', name: 'Annex', code: 'AN' }],
  onCheckIn: jest.fn(),
  pieceFormatOptions: [],
  values: {},
  poLine: { locations: [{ locationId: '001' }] },
  setSearchParams: jest.fn(),
  getHoldingsItemsAndPieces: jest.fn().mockReturnValue({
    then: () => ({}),
  }),
  setCreateAnotherChecked: jest.fn(),
  isCreateAnotherChecked: false,
};

const renderAddPieceModal = (props = defaultProps) => (render(
  <AddPieceModal
    {...props}
  />,
  { wrapper: MemoryRouter },
));

describe('AddPieceModal', () => {
  beforeEach(() => {
    defaultProps.close.mockClear();
    defaultProps.onCheckIn.mockClear();
    defaultProps.onSubmit.mockClear();
  });

  it('should display Add piece modal', () => {
    renderAddPieceModal();

    expect(screen.getByText('ui-receiving.piece.addPieceModal.title')).toBeDefined();
  });

  describe('Close Add piece modal', () => {
    it('should close Add piece modal', () => {
      renderAddPieceModal();

      user.click(screen.getByText('ui-receiving.piece.actions.cancel'));

      expect(defaultProps.close).toHaveBeenCalled();
    });
  });

  describe('Check display on holding', () => {
    it('should enable discovery suppress when clicked', () => {
      const format = 'Electronic';

      renderAddPieceModal({
        ...defaultProps,
        createInventoryValues: { [format]: INVENTORY_RECORDS_TYPE.instanceAndHolding },
        initialValues: {
          format,
        },
      });

      user.click(screen.getByText('ui-receiving.piece.displayOnHolding'));

      expect(screen.getByLabelText('ui-receiving.piece.discoverySuppress')).not.toHaveAttribute('disabled');
    });

    it('should not be visible when create inventory does not include holding', () => {
      renderAddPieceModal({
        ...defaultProps,
        initialValues: {
          format: INVENTORY_RECORDS_TYPE.instance,
        },
      });

      expect(screen.queryByText('ui-receiving.piece.displayOnHolding')).toBeNull();
    });
  });

  describe('Save piece', () => {
    it('should call \'onSubmit\' when save button was clicked', async () => {
      const format = 'Electronic';

      renderAddPieceModal({
        ...defaultProps,
        createInventoryValues: { [format]: INVENTORY_RECORDS_TYPE.instanceAndHolding },
        initialValues: {
          format,
          id: 'pieceId',
          holdingId: 'holdingId',
        },
      });

      const saveAndCloseBtn = await screen.findByRole('button', {
        name: 'ui-receiving.piece.actions.saveAndClose',
      });

      user.click(saveAndCloseBtn);
      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });
  });

  describe('Create another piece', () => {
    it('should call \'setCreateAnotherChecked\' when \'Create another\' checkbox was clicked', async () => {
      renderAddPieceModal();

      const createAnotherCheckbox = await screen.findByText('ui-receiving.piece.actions.createAnother');

      user.click(createAnotherCheckbox);
      expect(defaultProps.setCreateAnotherChecked).toHaveBeenCalled();
    });

    it('should update footer btns when \'Create another\' is active', async () => {
      renderAddPieceModal({
        ...defaultProps,
        isCreateAnotherChecked: true,
      });

      const saveBtn = await screen.findByRole('button', {
        name: 'ui-receiving.piece.actions.save',
      });

      const quickReceiveBtn = await screen.findByRole('button', {
        name: 'ui-receiving.piece.actions.quickReceive',
      });

      expect(saveBtn).toBeInTheDocument();
      expect(quickReceiveBtn.classList.contains('primary')).toBeTruthy();
    });
  });
});
