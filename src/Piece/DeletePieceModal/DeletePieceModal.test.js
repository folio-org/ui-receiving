import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  act,
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useHoldingsAbandonmentAnalyzer } from '@folio/stripes-acq-components';

import { DeletePieceModal } from './DeletePieceModal';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => 'Loading'),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useHoldingsAbandonmentAnalyzer: jest.fn(),
}));
jest.mock('../../common/hooks', () => ({
  useHoldingItems: () => ({ itemsCount: 0, isFetching: false }),
  usePieces: () => ({ piecesCount: 1, isFetching: false }),
}));

const defaultProps = {
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
  piece: {
    id: 'pieceId',
    itemId: 'itemId',
    holdingId: 'holdingsRecordId',
  },
  setIsLoading: jest.fn(),
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderDeletePieceModal = (props = {}) => render(
  <DeletePieceModal
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('DeletePieceModal', () => {
  const analyzeHoldings = jest.fn(() => Promise.resolve([{ abandoned: false }]));
  const analyzerFactory = jest.fn(() => Promise.resolve({ analyze: analyzeHoldings }));

  beforeEach(() => {
    useHoldingsAbandonmentAnalyzer.mockReturnValue({ analyzerFactory });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render default delete piece modal', async () => {
    analyzeHoldings.mockResolvedValue([{ abandoned: true }]);

    renderDeletePieceModal();

    await waitFor(() => expect(screen.queryByText('Loading')).not.toBeInTheDocument());

    expect(screen.getByText('ui-receiving.piece.actions.cancel')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.delete.heading')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.actions.delete.deleteItem')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.actions.delete.deleteHoldingsAndItem')).toBeInTheDocument();
  });

  it('should render delete piece (with holding) modal', async () => {
    renderDeletePieceModal({
      piece: {
        holdingId: null,
      },
    });

    await waitFor(() => expect(screen.queryByText('Loading')).not.toBeInTheDocument());

    expect(screen.getByText('ui-receiving.piece.actions.cancel')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.delete.heading')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.delete.confirm')).toBeInTheDocument();
  });

  it('should call onCancel when cancel was clicked', async () => {
    renderDeletePieceModal();

    const cancelBtn = await screen.findByText('ui-receiving.piece.actions.cancel');

    await user.click(cancelBtn);
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should call onConfirm when delete btn was clicked', async () => {
    analyzeHoldings.mockResolvedValue([{ abandoned: true }]);

    renderDeletePieceModal();

    await waitFor(() => expect(screen.queryByText('Loading')).not.toBeInTheDocument());

    await act(async () => {
      await user.click(await screen.findByText('ui-receiving.piece.actions.delete.deleteHoldingsAndItem'));
    });

    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });
});
