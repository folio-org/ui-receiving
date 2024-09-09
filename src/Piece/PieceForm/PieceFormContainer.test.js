import user from '@folio/jest-config-stripes/testing-library/user-event';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import {
  ORDER_FORMATS,
  ORDER_STATUSES,
  PIECE_STATUS,
  useAcqRestrictions,
  useLocationsQuery,
  useOrderLine,
} from '@folio/stripes-acq-components';

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
  useCentralOrderingContext: jest.fn(),
  useAcqRestrictions: jest.fn(),
  useLocationsQuery: jest.fn(),
  useOrderLine: jest.fn(),
}));
jest.mock('../../common/components/LineLocationsView/LineLocationsView', () => jest.fn().mockReturnValue('LineLocationsView'));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useHoldingItems: jest.fn(),
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

const mutatePieceMock = jest.fn(() => Promise.resolve());
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
  beforeEach(() => {
    mutatePieceMock.mockClear();
    useAcqRestrictions
      .mockClear()
      .mockReturnValue({ restrictions });
    useHoldingItems
      .mockClear()
      .mockReturnValue({ itemsCount: 2 });
    useOrder
      .mockClear()
      .mockReturnValue({ order });
    useOrderLine
      .mockClear()
      .mockReturnValue({ orderLine });
    useLocationsQuery
      .mockClear()
      .mockReturnValue({ locations });
    usePieceMutator
      .mockClear()
      .mockReturnValue({ mutatePiece: mutatePieceMock });
    usePieces
      .mockClear()
      .mockReturnValue({ piecesCount: 2 });
    usePieceQuickReceiving
      .mockClear()
      .mockReturnValue({
        onCancelReceive: jest.fn(),
        onConfirmReceive: jest.fn(),
        onQuickReceive: onQuickReceiveMock,
      });
    useTitle
      .mockClear()
      .mockReturnValue({ title });
    useReceive
      .mockClear()
      .mockReturnValue({ receive: receiveMock });
    useUnreceive
      .mockClear()
      .mockReturnValue({ unreceive: unreceiveMock });
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
});
