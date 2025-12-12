import {
  act,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { dayjs } from '@folio/stripes/components';
import {
  FieldInventory,
  INVENTORY_RECORDS_TYPE,
  PIECE_FORMAT,
  PIECE_STATUS,
  useCurrentUserTenants,
} from '@folio/stripes-acq-components';

import { renderWithRouter } from 'helpers';
import { PIECE_FORM_FIELD_NAMES } from '../../common/constants';
import { PIECE_ACTION_NAMES } from '../constants';
import { usePieceStatusChangeLog } from '../hooks';
import PieceForm from './PieceForm';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FieldInventory: jest.fn().mockReturnValue('FieldInventory'),
  useCentralOrderingContext: jest.fn(),
  useCurrentUserTenants: jest.fn(),
}));
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
  initialValues: {
    isCreateAnother: false,
    [PIECE_FORM_FIELD_NAMES.sequenceNumber]: 42,
  },
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
const tenants = [{
  id: 'tenantId1',
  name: 'tenantName1',
  isPrimary: true,
},
{
  id: 'tenantId1',
  name: 'tenantName1',
  isPrimary: false,
}];
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
const today = dayjs();

const renderPieceForm = (props = {}) => renderWithRouter(
  <PieceForm
    {...defaultProps}
    {...props}
  />,
);

const findButton = (name) => screen.findByRole('button', { name });

const createNewHoldingForThePiece = (newHoldingId = 'newHoldingUUID') => {
  return act(async () => FieldInventory.mock.calls[0][0].onChange(null, 'locationId', 'holdingId', newHoldingId));
};

describe('PieceForm', () => {
  beforeEach(() => {
    useCurrentUserTenants.mockReturnValue(tenants);
    usePieceStatusChangeLog.mockReturnValue({ data: logs });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the piece form', () => {
    renderPieceForm();

    expect(screen.getByText(defaultProps.paneTitle)).toBeInTheDocument();
  });

  describe('Close piece form', () => {
    it('should close the piece form', async () => {
      renderPieceForm();

      await userEvent.click(await findButton('ui-receiving.piece.actions.cancel'));

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

      await userEvent.click(screen.getByText('ui-receiving.piece.displayOnHolding'));

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

      await userEvent.click(screen.getByText('ui-receiving.piece.displayOnHolding'));

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

      await userEvent.click(displayOnHolding);

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
        createInventoryValues: {
          [PIECE_FORMAT.physical]: INVENTORY_RECORDS_TYPE.instanceAndHolding,
        },
        initialValues: {
          format: PIECE_FORMAT.physical,
          isBound: true,
          bindItemId: 'bindItemId',
          receivingStatus: PIECE_STATUS.received,
          itemId: '1',
        },
      });

      const boundCheckbox = screen.getByLabelText('ui-receiving.piece.isBound');

      expect(boundCheckbox).toBeChecked();
      expect(screen.getByText('ui-receiving.piece.accordion.originalItemDetails')).toBeInTheDocument();
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
          [PIECE_FORM_FIELD_NAMES.sequenceNumber]: 42,
        },
      });

      await userEvent.click(await findButton('stripes-components.saveAndClose'));
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
            [PIECE_FORM_FIELD_NAMES.sequenceNumber]: 42,
          },
        });

        await createNewHoldingForThePiece();
        await userEvent.click(await findButton('stripes-components.saveAndClose'));

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
          [PIECE_FORM_FIELD_NAMES.sequenceNumber]: 42,
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
        [PIECE_FORM_FIELD_NAMES.sequenceNumber]: 42,
      },
    });

    const formatlabel = screen.getByText('ui-receiving.piece.format');

    await userEvent.click(formatlabel);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'ui-receiving.piece.format' }), 'Electronic');

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
        itemId: 'itemUUID',
        request: {},
        [PIECE_FORM_FIELD_NAMES.sequenceNumber]: 42,
      },
    });

    const dropdownButton = screen.getByTestId('dropdown-trigger-button');

    await userEvent.click(dropdownButton);

    const unreceivableButton = screen.getByTestId('unreceivable-button');

    await userEvent.click(unreceivableButton);

    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  describe('Actions', () => {
    const date = today.add(3, 'days');

    it('should handle "Unreceive" action', async () => {
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
          [PIECE_FORM_FIELD_NAMES.sequenceNumber]: 42,
        },
      });

      await userEvent.click(screen.getByTestId('dropdown-trigger-button'));
      await userEvent.click(await screen.findByTestId('unReceive-piece-button'));

      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ postSubmitAction: PIECE_ACTION_NAMES.unReceive }),
        expect.anything(),
        expect.anything(),
      );
    });

    it('should handle "Delay claim" action', async () => {
      renderPieceForm({
        initialValues: {
          format: PIECE_FORMAT.other,
          holdingId: '60c67dc5-b646-425e-bf08-a8bf2d0681fb',
          [PIECE_FORM_FIELD_NAMES.sequenceNumber]: 42,
        },
      });

      await userEvent.click(screen.getByTestId('dropdown-trigger-button'));
      await userEvent.click(screen.getByTestId('delay-claim-button'));
      await userEvent.type(screen.getByRole('textbox', { name: /field.delayTo/ }), date.format(DATE_FORMAT));
      await userEvent.click(await findButton('stripes-acq-components.FormFooter.save'));

      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          claimingInterval: 3,
          nextReceivingStatus: PIECE_STATUS.claimDelayed,
        }),
        expect.anything(),
        expect.anything(),
      );
    });
  });
});
