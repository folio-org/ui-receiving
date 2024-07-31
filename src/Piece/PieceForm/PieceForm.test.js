import moment from 'moment';
import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  act,
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  FieldInventory,
  INVENTORY_RECORDS_TYPE,
  PIECE_FORMAT,
  PIECE_STATUS,
} from '@folio/stripes-acq-components';

import { usePieceStatusChangeLog } from '../hooks';
import PieceForm from './PieceForm';

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    FieldInventory: jest.fn().mockReturnValue('FieldInventory'),
    useCentralOrderingContext: jest.fn(),
  };
});
jest.mock('../../common/components/LineLocationsView/LineLocationsView', () => jest.fn().mockReturnValue('LineLocationsView'));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  usePieceStatusChangeLog: jest.fn(),
}));

const defaultProps = {
  form: {
    getState: jest.fn().mockReturnValue({
      values: {
        holdingId: 'holding',
      },
    }),
  },
  hasValidationErrors: false,
  checkHoldingAbandonment: jest.fn(() => Promise.resolve({ willAbandoned: false })),
  createInventoryValues: {},
  onClose: jest.fn(),
  onDelete: jest.fn(),
  onSubmit: jest.fn(),
  onUnreceive: jest.fn(),
  initialValues: { isCreateAnother: false },
  instanceId: 'instanceId',
  locationIds: [],
  locations: [{ id: '001', name: 'Annex', code: 'AN' }],
  paneTitle: 'Piece form',
  pieceFormatOptions: [],
  poLine: { locations: [{ locationId: '001' }] },
  restrictionsByAcqUnit: {},
  values: {},
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

const DATE_FORMAT = 'MM/DD/YYYY';
const today = moment();

const renderPieceForm = (props = {}) => render(
  <PieceForm
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const findButton = (name) => screen.findByRole('button', { name });

const createNewHoldingForThePiece = (newHoldingId = 'newHoldingUUID') => {
  return act(async () => FieldInventory.mock.calls[0][0].onChange(null, 'locationId', 'holdingId', newHoldingId));
};

describe('PieceForm', () => {
  beforeEach(() => {
    defaultProps.checkHoldingAbandonment.mockClear();
    defaultProps.onClose.mockClear();
    defaultProps.onDelete.mockClear();
    defaultProps.onSubmit.mockClear();
    defaultProps.onUnreceive.mockClear();
    FieldInventory.mockClear();
    usePieceStatusChangeLog
      .mockClear()
      .mockReturnValue({ data: logs });
  });

  it('should display the piece form', () => {
    renderPieceForm();

    expect(screen.getByText(defaultProps.paneTitle)).toBeInTheDocument();
  });

  describe('Close piece form', () => {
    it('should close the piece form', async () => {
      renderPieceForm();

      await user.click(await findButton('ui-receiving.piece.actions.cancel'));

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Check display on holding', () => {
    // https://folio-org.atlassian.net/browse/UIREC-208
    it.skip('should enable discovery suppress when clicked', async () => {
      const format = PIECE_FORMAT.electronic;

      renderPieceForm({
        createInventoryValues: { [format]: INVENTORY_RECORDS_TYPE.instanceAndHolding },
        initialValues: {
          format,
        },
      });

      await user.click(screen.getByText('ui-receiving.piece.displayOnHolding'));

      expect(screen.getByLabelText('ui-receiving.piece.discoverySuppress')).not.toHaveAttribute('disabled');
    });

    it('should not be visible when create inventory does not include holding', () => {
      renderPieceForm({
        initialValues: {
          format: INVENTORY_RECORDS_TYPE.instance,
        },
      });

      expect(screen.queryByText('ui-receiving.piece.displayOnHolding')).toBeNull();
    });

    it('should display `Display to public` checkbox', async () => {
      renderPieceForm({
        createInventoryValues: { [PIECE_FORMAT.physical]: INVENTORY_RECORDS_TYPE.instanceAndHolding },
        initialValues: {
          format: PIECE_FORMAT.physical,
        },
      });

      expect(screen.getByText('ui-receiving.piece.displayOnHolding')).toBeInTheDocument();

      await user.click(screen.getByText('ui-receiving.piece.displayOnHolding'));

      const displayToPublic = await screen.findByLabelText('ui-receiving.piece.displayToPublic');

      expect(displayToPublic).toBeInTheDocument();
    });

    it('should hide `Display to public` checkbox', async () => {
      renderPieceForm({
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

    it('should `Bound` checkbox must be disabled if the pieces status is not `Received`', async () => {
      renderPieceForm({
        createInventoryValues: { [PIECE_FORMAT.physical]: INVENTORY_RECORDS_TYPE.instanceAndHolding },
        initialValues: {
          format: PIECE_FORMAT.physical,
          displayOnHolding: true,
          displayToPublic: true,
          receivingStatus: PIECE_STATUS.expected,
        },
      });

      const boundCheckbox = screen.getByLabelText('ui-receiving.piece.isBound');

      expect(boundCheckbox).toBeDisabled();
    });

    it('should display item details original when `Bound` has been checked and has `bindItemId`', async () => {
      renderPieceForm({
        createInventoryValues: { [PIECE_FORMAT.physical]: INVENTORY_RECORDS_TYPE.instanceAndHolding },
        initialValues: {
          format: PIECE_FORMAT.physical,
          isBound: true,
          bindItemId: 'bindItemId',
          receivingStatus: PIECE_STATUS.received,
        },
      });

      const boundCheckbox = screen.getByLabelText('ui-receiving.piece.isBound');

      expect(boundCheckbox).toBeChecked();
      expect(screen.getByText('ui-receiving.piece.accordion.originalItemDetails')).toBeDefined();
    });
  });

  describe('Save piece', () => {
    it('should call \'onSubmit\' when save button was clicked', async () => {
      const format = PIECE_FORMAT.electronic;

      renderPieceForm({
        createInventoryValues: { [format]: INVENTORY_RECORDS_TYPE.instanceAndHolding },
        initialValues: {
          format,
          id: 'pieceId',
          holdingId: holding.id,
        },
      });

      await user.click(await findButton('stripes-components.saveAndClose'));
      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });

    describe('Abandoned holdings', () => {
      it('should display the modal for deleting abandoned holding when the original holding is empty after changing to a new one', async () => {
        defaultProps.checkHoldingAbandonment.mockResolvedValue({ willAbandoned: true });

        renderPieceForm({
          initialValues: {
            id: 'pieceId',
            format: PIECE_FORMAT.physical,
            holdingId: holding.id,
          },
        });

        await createNewHoldingForThePiece();
        await user.click(await findButton('stripes-components.saveAndClose'));

        expect(await screen.findByText('stripes-acq-components.holdings.deleteModal.message')).toBeInTheDocument();
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Create another piece', () => {
    it('should update footer button when \'Create another\' is active', async () => {
      renderPieceForm({
        initialValues: {
          isCreateAnother: true,
          receivingStatus: PIECE_STATUS.expected,
        },
      });

      const saveBtn = await screen.findByTestId('quickReceive');

      expect(saveBtn).toBeInTheDocument();
    });
  });

  it('should clear Item details inputs when change format from physical to electronic', async () => {
    renderPieceForm({
      pieceFormatOptions: [
        { value: PIECE_FORMAT.physical, label: 'Physical' },
        { value: PIECE_FORMAT.electronic, label: 'Electronic' },
        { value: PIECE_FORMAT.other, label: 'Other' },
      ],
      initialValues: {
        isCreateAnother: true,
        receivingStatus: PIECE_STATUS.expected,
        format: PIECE_FORMAT.physical,
        barcode: 'barcode',
        callNumber: 'callNumber',
      },
    });

    const formatlabel = screen.getByText('ui-receiving.piece.format');

    await user.click(formatlabel);
    await user.selectOptions(screen.getByRole('combobox', { name: 'ui-receiving.piece.format' }), 'Electronic');

    expect(screen.getByLabelText('ui-receiving.piece.barcode')).toHaveValue('');
    expect(screen.getByLabelText('ui-receiving.piece.callNumber')).toHaveValue('');
  });

  it('should update piece status', async () => {
    const onChange = jest.fn();

    renderPieceForm({
      form: {
        ...defaultProps.form,
        change: onChange,
      },
      hasValidationErrors: false,
      initialValues: {
        id: 'cd3fd1e7-c195-4d8e-af75-525e1039d643',
        format: 'Other',
        poLineId: 'a92ae36c-e093-4daf-b234-b4c6dc33a258',
        titleId: '03329fea-1b5d-43ab-b955-20bcd9ba530d',
        holdingId: '60c67dc5-b646-425e-bf08-a8bf2d0681fb',
        isCreateAnother: false,
        isCreateItem: false,
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
    renderPieceForm({
      hasValidationErrors: false,
      initialValues: {
        id: 'cd3fd1e7-c195-4d8e-af75-525e1039d643',
        format: 'Other',
        poLineId: 'a92ae36c-e093-4daf-b234-b4c6dc33a258',
        titleId: '03329fea-1b5d-43ab-b955-20bcd9ba530d',
        holdingId: '60c67dc5-b646-425e-bf08-a8bf2d0681fb',
        isCreateAnother: false,
        isCreateItem: false,
        receivingStatus: PIECE_STATUS.received,
        receivedDate: new Date().toISOString(),
      },
    });

    await user.click(screen.getByTestId('dropdown-trigger-button'));
    const unReceiveButton = await screen.findByTestId('unReceive-piece-button');

    expect(unReceiveButton).toBeInTheDocument();
    await user.click(unReceiveButton);

    expect(defaultProps.onUnreceive).toHaveBeenCalled();
  });

  describe('Actions', () => {
    const initialValues = {
      format: PIECE_FORMAT.other,
      holdingId: '60c67dc5-b646-425e-bf08-a8bf2d0681fb',
    };
    const date = today.add(3, 'days');

    beforeEach(async () => {
      renderPieceForm({ initialValues });

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
