import moment from 'moment';
import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  act,
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import {
  FieldInventory,
  INVENTORY_RECORDS_TYPE,
  PIECE_FORMAT,
  PIECE_STATUS,
} from '@folio/stripes-acq-components';

import { usePieceStatusChangeLog } from '../hooks';
import AddPieceModal from './AddPieceModal';

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    FieldInventory: jest.fn().mockReturnValue('FieldInventory'),
  };
});
jest.mock('../../common/components/LineLocationsView/LineLocationsView',
  () => jest.fn().mockReturnValue('LineLocationsView'));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useUnreceive: jest.fn().mockReturnValue({ unreceive: jest.fn(() => Promise.resolve()) }),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  usePieceStatusChangeLog: jest.fn(),
}));

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
const userData = {
  id: 'user-1',
  personal: {
    lastName: 'Galt',
    firstName: 'John',
  },
};
const logs = [
  {
    eventDate: '2023-12-26T14:08:19.402Z',
    user: userData,
    receivingStatus: PIECE_STATUS.received,
  },
  {
    eventDate: '2023-12-25T14:08:18.402Z',
    user: userData,
    receivingStatus: PIECE_STATUS.expected,
  },
];

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve(holding),
  })),
};

const DATE_FORMAT = 'MM/DD/YYYY';
const today = moment();

const renderAddPieceModal = (props = {}) => render(
  <AddPieceModal
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

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
    usePieceStatusChangeLog
      .mockClear()
      .mockReturnValue({ data: logs });
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
        initialValues: {
          format: INVENTORY_RECORDS_TYPE.instance,
        },
      });

      expect(screen.queryByText('ui-receiving.piece.displayOnHolding')).toBeNull();
    });

    it('should display `Display to public` checkbox', async () => {
      renderAddPieceModal({
        createInventoryValues: { [PIECE_FORMAT.physical]: INVENTORY_RECORDS_TYPE.instanceAndHolding },
        initialValues: {
          format: PIECE_FORMAT.physical,
        },
      });

      expect(screen.getByText('ui-receiving.piece.displayOnHolding')).toBeDefined();

      await user.click(screen.getByText('ui-receiving.piece.displayOnHolding'));

      const displayToPublic = await screen.findByLabelText('ui-receiving.piece.displayToPublic');

      expect(displayToPublic).toBeInTheDocument();
    });

    it('should hide `Display to public` checkbox', async () => {
      renderAddPieceModal({
        createInventoryValues: { [PIECE_FORMAT.physical]: INVENTORY_RECORDS_TYPE.instanceAndHolding },
        initialValues: {
          format: PIECE_FORMAT.physical,
          displayOnHolding: true,
          displayToPublic: true,
        },
      });

      const displayOnHolding = screen.getByLabelText('ui-receiving.piece.displayOnHolding');

      await user.click(displayOnHolding);

      await waitFor(() => {
        expect(displayOnHolding).not.toBeChecked();
      });

      expect(screen.queryByLabelText('ui-receiving.piece.displayToPublic')).toBeNull();
    });
  });

  describe('Save piece', () => {
    it('should call \'onSubmit\' when save button was clicked', async () => {
      const format = PIECE_FORMAT.electronic;

      renderAddPieceModal({
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

    const unReceiveButton = screen.getByTestId('unReceivable-piece-button');

    await user.click(unReceiveButton);

    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it('should unreceive piece', async () => {
    const onUnreceive = jest.fn();

    renderAddPieceModal({
      onUnreceive,
      hasValidationErrors: false,
      initialValues: {
        'id': 'cd3fd1e7-c195-4d8e-af75-525e1039d643',
        'format': 'Other',
        'poLineId': 'a92ae36c-e093-4daf-b234-b4c6dc33a258',
        'titleId': '03329fea-1b5d-43ab-b955-20bcd9ba530d',
        'holdingId': '60c67dc5-b646-425e-bf08-a8bf2d0681fb',
        'isCreateAnother': false,
        'isCreateItem': false,
        receivingStatus: PIECE_STATUS.received,
        receivedDate: new Date().toISOString(),
      },
    });

    await user.click(screen.getByTestId('dropdown-trigger-button'));
    const unReceiveButton = await screen.findByTestId('unReceive-piece-button');

    expect(unReceiveButton).toBeInTheDocument();
    await user.click(unReceiveButton);

    expect(onUnreceive).toHaveBeenCalled();
  });

  describe('Actions', () => {
    const initialValues = {
      format: PIECE_FORMAT.other,
      holdingId: '60c67dc5-b646-425e-bf08-a8bf2d0681fb',
    };
    const date = today.add(3, 'days');

    beforeEach(async () => {
      renderAddPieceModal({ initialValues });

      await user.click(screen.getByTestId('dropdown-trigger-button'));
    });

    it('should handle "Delay claim" action', async () => {
      await user.click(screen.getByTestId('delay-claim-button'));
      await user.type(screen.getByRole('textbox', { name: 'ui-receiving.modal.delayClaim.field.delayTo' }), date.format(DATE_FORMAT));
      await user.click(await findButton('stripes-acq-components.FormFooter.save'));

      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          claimingInterval: 3,
          receivingStatus: PIECE_STATUS.claimDelayed,
        }),
        expect.anything(),
        expect.anything(),
      );
    });

    it('should handle "Send claim" action', async () => {
      await user.click(screen.getByTestId('send-claim-button'));
      await user.type(screen.getByRole('textbox', { name: 'ui-receiving.modal.sendClaim.field.claimExpiryDate' }), date.format(DATE_FORMAT));
      await user.click(await findButton('stripes-acq-components.FormFooter.save'));

      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          claimingInterval: 3,
          receivingStatus: PIECE_STATUS.claimSent,
        }),
        expect.anything(),
        expect.anything(),
      );
    });
  });
});
