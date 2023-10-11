import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';
import {
  FieldInventory,
  INVENTORY_RECORDS_TYPE,
  PIECE_FORMAT,
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
  initialValues: { isCreateAnother: false },
  instanceId: 'instanceId',
  isManuallyAddPieces: true,
  locationIds: [],
  locations: [{ id: '001', name: 'Annex', code: 'AN' }],
  onCheckIn: jest.fn(),
  pieceFormatOptions: [],
  values: {},
  poLine: { locations: [{ locationId: '001' }] },
  setSearchParams: jest.fn(),
  getHoldingsItemsAndPieces: jest.fn(),
};

const holding = {
  id: 'holdingId',
};

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve(holding),
  })),
};

const renderAddPieceModal = (props = defaultProps) => (render(
  <AddPieceModal
    {...props}
  />,
  { wrapper: MemoryRouter },
));

const findButton = (name) => screen.findByRole('button', { name });

const createNewHoldingForThePiece = (newHoldingId = 'newHoldingUUID') => {
  return act(async () => FieldInventory.mock.calls[0][0].onChange(null, 'locationId', 'holdingId', newHoldingId));
};

describe('AddPieceModal', () => {
  beforeEach(() => {
    defaultProps.close.mockClear();
    defaultProps.onCheckIn.mockClear();
    defaultProps.onSubmit.mockClear();
    defaultProps.getHoldingsItemsAndPieces.mockClear();
    FieldInventory.mockClear();
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should display Add piece modal', () => {
    renderAddPieceModal();

    expect(screen.getByText('ui-receiving.piece.addPieceModal.title')).toBeDefined();
  });

  describe('Close Add piece modal', () => {
    it('should close Add piece modal', async () => {
      renderAddPieceModal();

      await user.click(await findButton('ui-receiving.piece.actions.cancel'));

      expect(defaultProps.close).toHaveBeenCalled();
    });
  });

  describe('Check display on holding', () => {
    it.skip('should enable discovery suppress when clicked', async () => {
      const format = PIECE_FORMAT.electronic;

      renderAddPieceModal({
        ...defaultProps,
        createInventoryValues: { [format]: INVENTORY_RECORDS_TYPE.instanceAndHolding },
        initialValues: {
          format,
        },
      });

      await user.click(screen.getByText('ui-receiving.piece.displayOnHolding'));

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
      const format = PIECE_FORMAT.electronic;

      renderAddPieceModal({
        ...defaultProps,
        createInventoryValues: { [format]: INVENTORY_RECORDS_TYPE.instanceAndHolding },
        initialValues: {
          format,
          id: 'pieceId',
          holdingId: holding.id,
        },
      });

      await user.click(await findButton('ui-receiving.piece.actions.saveAndClose'));
      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });

    describe('Abandoned holdings', () => {
      it('should display the modal for deleting abandoned holding when the original holding is empty after changing to a new one', async () => {
        defaultProps.getHoldingsItemsAndPieces.mockResolvedValue({
          pieces: { totalRecords: 1 },
          items: { totalRecords: 0 },
        });

        renderAddPieceModal({
          ...defaultProps,
          initialValues: {
            id: 'pieceId',
            format: PIECE_FORMAT.physical,
            holdingId: holding.id,
          },
        });

        await createNewHoldingForThePiece();
        await user.click(await findButton('ui-receiving.piece.actions.saveAndClose'));

        expect(await screen.findByText('ui-receiving.piece.actions.edit.deleteHoldings.message')).toBeInTheDocument();
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
      });

      it('should NOT display the modal for deleting abandoned holding if it has already been deleted', async () => {
        kyMock.get.mockReturnValue(({ json: () => Promise.reject(new Error('404')) }));

        renderAddPieceModal({
          ...defaultProps,
          initialValues: {
            id: 'pieceId',
            format: PIECE_FORMAT.physical,
            holdingId: holding.id,
          },
        });

        await createNewHoldingForThePiece();
        await user.click(await findButton('ui-receiving.piece.actions.saveAndClose'));

        expect(screen.queryByText('ui-receiving.piece.actions.edit.deleteHoldings.message')).not.toBeInTheDocument();
        expect(defaultProps.onSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Create another piece', () => {
    it('should update footer btns when \'Create another\' is active', async () => {
      renderAddPieceModal({
        ...defaultProps,
        initialValues: { isCreateAnother: true },
      });

      const saveBtn = await findButton('ui-receiving.piece.actions.quickReceive');
      const quickReceiveBtn = await findButton('ui-receiving.piece.actions.quickReceive');

      expect(saveBtn).toBeInTheDocument();
      expect(quickReceiveBtn.classList.contains('primary')).toBeTruthy();
    });
  });
});
