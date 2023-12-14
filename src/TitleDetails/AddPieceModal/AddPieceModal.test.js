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
import { PIECE_STATUS } from './ModalActionButtons/constants';

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
    it('should update footer button when \'Create another\' is active', async () => {
      renderAddPieceModal({
        ...defaultProps,
        initialValues: {
          isCreateAnother: true,
          receivingStatus: PIECE_STATUS.expected,
        },
      });

      const saveBtn = await screen.findByTestId('quickReceive');

      expect(saveBtn).toBeInTheDocument();
    });
  });

  it('should update piece status', async () => {
    const onChange = jest.fn();

    renderAddPieceModal({
      ...defaultProps,
      form: {
        ...defaultProps.form,
        change: onChange,
      },
      hasValidationErrors: false,
      initialValues: {
        'id': 'cd3fd1e7-c195-4d8e-af75-525e1039d643',
        'format': 'Other',
        'poLineId': 'a92ae36c-e093-4daf-b234-b4c6dc33a258',
        'titleId': '03329fea-1b5d-43ab-b955-20bcd9ba530d',
        'holdingId': '60c67dc5-b646-425e-bf08-a8bf2d0681fb',
        'isCreateAnother': false,
        'isCreateItem': false,
        receivingStatus: PIECE_STATUS.expected,
      },
    });

    const dropdownButton = screen.getByTestId('dropdown-trigger-button');

    await user.click(dropdownButton);
    await screen.findByRole('button', { expanded: true });

    const unReceiveButton = screen.getByTestId('unReceivable-piece-button');

    await user.click(unReceiveButton);

    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
});
