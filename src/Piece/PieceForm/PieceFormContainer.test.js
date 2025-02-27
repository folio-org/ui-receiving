import user from '@folio/jest-config-stripes/testing-library/user-event';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import { dayjs } from '@folio/stripes/components';
import {
  ORDER_FORMATS,
  ORDER_STATUSES,
  PIECE_STATUS,
  useAcqRestrictions,
  useClaimsSend,
  useCurrentUserTenants,
  useLocationsQuery,
  useOrderLine,
  usePiecesStatusBatchUpdate,
} from '@folio/stripes-acq-components';
import { useOkapiKy } from '@folio/stripes/core';

import { renderWithRouter } from '../../../test/jest/helpers';
import {
  useHoldingItems,
  useOrder,
  usePieceMutator,
  usePieces,
  useReceive,
  useTitle,
  useUnreceive,
} from '../../common/hooks';
import { usePieceQuickReceiving } from '../hooks';
import { PieceFormContainer } from './PieceFormContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FieldInventory: jest.fn().mockReturnValue('FieldInventory'),
  useAcqRestrictions: jest.fn(),
  useCentralOrderingContext: jest.fn(),
  useClaimsSend: jest.fn(),
  useCurrentUserTenants: jest.fn(),
  useLocationsQuery: jest.fn(),
  useOrderLine: jest.fn(),
  usePiecesStatusBatchUpdate: jest.fn(),
}));
jest.mock('../../common/components/LineLocationsView/LineLocationsView', () => jest.fn().mockReturnValue('LineLocationsView'));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useHoldingItems: jest.fn(),
  useNumberGeneratorOptions: jest.fn(() => ({ data: [] })),
  useOrder: jest.fn(),
  usePieceMutator: jest.fn(),
  usePieces: jest.fn(),
  useReceive: jest.fn(),
  useTitle: jest.fn(),
  useUnreceive: jest.fn(),
}));
jest.mock('../../common/utils', () => ({
  ...jest.requireActual('../../common/utils'),
  getHoldingsItemsAndPieces: jest.fn(() => () => Promise.resolve({
    pieces: { totalRecords: 2 },
    items: { totalRecords: 1 },
  })),
  getItemById: jest.fn(() => () => Promise.resolve({})),
  getPieceById: jest.fn(() => () => Promise.resolve({ json: () => ({}) })),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  usePieceQuickReceiving: jest.fn(),
  usePieceStatusChangeLog: jest.fn(() => ({ data: [] })),
}));

const DATE_FORMAT = 'MM/DD/YYYY';
const today = dayjs();

const mutatePieceMock = jest.fn(() => Promise.resolve({ id: 'piece-id' }));
const unreceiveMock = jest.fn(() => Promise.resolve());
const onQuickReceiveMock = jest.fn(() => Promise.resolve());
const receiveMock = jest.fn(() => Promise.resolve());

const locations = [
  {
    id: 'location-id',
    code: 'LC',
  },
];

const order = {
  id: 'order-id',
  workflowStatus: ORDER_STATUSES.pending,
};

const orderLine = {
  id: 'order-line-id',
  purchaseOrderId: order.id,
  locations: locations.map(({ id }) => ({ locationId: id })),
  orderFormat: ORDER_FORMATS.physicalResource,
};

const title = {
  instanceId: 'instanceId',
  poLineId: orderLine.id,
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

const restrictions = {};

const defaultProps = {
  initialValues: {
    id: 'piece-id',
    holdingId: 'holdingId',
    format: ORDER_FORMATS.physicalResource,
  },
  paneTitle: 'Piece form',
};

const renderPieceFormContainer = (props = {}) => renderWithRouter(
  <PieceFormContainer
    {...defaultProps}
    {...props}
  />,
);

describe('PieceFormContainer', () => {
  const sendClaims = jest.fn(() => Promise.resolve());
  const updatePiecesStatus = jest.fn(() => Promise.resolve());

  const kyMock = {
    get: jest.fn(() => ({ json: () => Promise.resolve({ configs: [] }) })),
  };

  beforeEach(() => {
    useAcqRestrictions.mockReturnValue({ restrictions });
    useClaimsSend.mockReturnValue({ sendClaims });
    useCurrentUserTenants.mockReturnValue(tenants);
    useHoldingItems.mockReturnValue({ itemsCount: 2 });
    useOkapiKy.mockReturnValue(kyMock);
    useOrder.mockReturnValue({ order });
    useOrderLine.mockReturnValue({ orderLine });
    useLocationsQuery.mockReturnValue({ locations });
    usePieceMutator.mockReturnValue({ mutatePiece: mutatePieceMock });
    usePieces.mockReturnValue({ piecesCount: 2 });
    usePiecesStatusBatchUpdate.mockReturnValue({ updatePiecesStatus });
    usePieceQuickReceiving.mockReturnValue({
      onCancelReceive: jest.fn(),
      onConfirmReceive: jest.fn(),
      onQuickReceive: onQuickReceiveMock,
    });
    useTitle.mockReturnValue({ title });
    useReceive.mockReturnValue({ receive: receiveMock });
    useUnreceive.mockReturnValue({ unreceive: unreceiveMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the piece form', () => {
    renderPieceFormContainer();

    expect(screen.getByText(defaultProps.paneTitle)).toBeInTheDocument();
  });

  it('should handle save action', async () => {
    renderPieceFormContainer({
      initialValues: {
        ...defaultProps.initialValues,
        receivingStatus: PIECE_STATUS.expected,
      },
    });

    await user.type(await screen.findByLabelText('ui-receiving.piece.displaySummary'), 'Test');
    await user.click(await screen.findByTestId('dropdown-trigger-button'));
    await user.click(await screen.findByText('stripes-components.saveAndClose'));

    expect(mutatePieceMock).toHaveBeenCalled();
  });

  it('should handle quick receive action', async () => {
    renderPieceFormContainer({
      initialValues: {
        ...defaultProps.initialValues,
        receivingStatus: PIECE_STATUS.expected,
      },
    });

    await user.click(await screen.findByTestId('dropdown-trigger-button'));
    await user.click(await screen.findByTestId('quickReceive'));

    expect(onQuickReceiveMock).toHaveBeenCalled();
  });

  it('should handle unreceive action', async () => {
    renderPieceFormContainer({
      initialValues: {
        ...defaultProps.initialValues,
        receivingStatus: PIECE_STATUS.received,
      },
    });

    await user.click(await screen.findByTestId('dropdown-trigger-button'));
    await user.click(await screen.findByTestId('unReceive-piece-button'));

    expect(unreceiveMock).toHaveBeenCalled();
  });

  it('should handle delete action', async () => {
    useOrder.mockReturnValue({
      order: {
        ...order,
        workflowStatus: ORDER_STATUSES.open,
      },
    });

    renderPieceFormContainer({
      initialValues: {
        ...defaultProps.initialValues,
        receivingStatus: PIECE_STATUS.expected,
      },
    });

    await user.click(await screen.findByTestId('dropdown-trigger-button'));
    await user.click(await screen.findByTestId('delete-piece-button'));
    await user.click(await screen.findByText('ui-receiving.piece.delete.confirm'));

    expect(mutatePieceMock).toHaveBeenCalledWith(expect.objectContaining({
      options: expect.objectContaining({
        method: 'delete',
      }),
    }));
  });

  it('should handle "Send claim" action with claiming integration', async () => {
    kyMock.get.mockReturnValueOnce({ json: () => Promise.resolve({ configs: [{ value: 'val' }] }) });

    renderPieceFormContainer();

    await user.click(await screen.findByTestId('dropdown-trigger-button'));
    await user.click(screen.getByTestId('send-claim-button'));

    expect(screen.getByText('ui-receiving.piece.sendClaim.withIntegration.message')).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: /sendClaim.field.claimExpiryDate/ }), today.add(3, 'days').format(DATE_FORMAT));
    await user.click(await screen.findByRole('button', { name: 'stripes-acq-components.FormFooter.save' }));

    expect(sendClaims).toHaveBeenCalledWith({
      data: {
        claimingInterval: 3,
        externalNote: undefined,
        internalNote: undefined,
        claimingPieceIds: ['piece-id'],
      },
    });
  });

  it('should handle "Send claim" action without claiming integration', async () => {
    renderPieceFormContainer();

    await user.click(await screen.findByTestId('dropdown-trigger-button'));
    await user.click(screen.getByTestId('send-claim-button'));

    expect(screen.getByText('ui-receiving.piece.sendClaim.withoutIntegration.message')).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: /sendClaim.field.claimExpiryDate/ }), today.add(3, 'days').format(DATE_FORMAT));
    await user.click(await screen.findByRole('button', { name: 'stripes-acq-components.FormFooter.save' }));

    expect(updatePiecesStatus).toHaveBeenCalledWith({
      data: {
        claimingInterval: 3,
        pieceIds: ['piece-id'],
        receivingStatus: PIECE_STATUS.claimSent,
      },
    });
  });
});
