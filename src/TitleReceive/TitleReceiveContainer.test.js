import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useHoldingsAbandonmentAnalyzer } from '@folio/stripes-acq-components';

import {
  useReceive,
  useTitleHydratedPieces,
} from '../common/hooks';
import TitleReceiveContainer from './TitleReceiveContainer';
import TitleReceive from './TitleReceive';
import { getHoldingsAbandonmentCheckData } from './getHoldingsAbandonmentCheckData';
import { useDeleteHoldingsModal } from './useDeleteHoldingsModal';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
  useHoldingsAbandonmentAnalyzer: jest.fn(),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  stripesConnect: jest.fn(c => c),
}));
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingPane: jest.fn().mockReturnValue('LoadingPane'),
}));
jest.mock('../common/hooks', () => ({
  useReceive: jest.fn().mockReturnValue({}),
  useTitleHydratedPieces: jest.fn(),
  useReceivingTenantIdsAndLocations: jest.fn().mockReturnValue({}),
}));
jest.mock('./TitleReceive', () => jest.fn().mockReturnValue('TitleReceive'));
jest.mock('./getHoldingsAbandonmentCheckData');
jest.mock('./useDeleteHoldingsModal');

const mockTitle = { title: 'Title', id: '001', poLineId: '002', instanceId: 'instanceId' };
const mockPoLine = { id: '002', locations: [{ locationId: '1' }] };
const mockPieces = [{ id: '01', locationId: '1' }];
const mockHoldings = [{ id: 'holding-1', permanentLocationId: 'location-1' }];
const mockLocations = [{ id: 'location-1', name: 'Main Library' }];
const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  push: jest.fn(),
  replace: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
  location: locationMock,
};

const mockAnalyze = jest.fn();
const mockAnalyzerFactory = jest.fn();
const mockInitDeleteHoldingsModal = jest.fn();
const mockDeleteHoldingsModal = null;

const renderTitleReceiveContainer = () => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <TitleReceiveContainer
        history={historyMock}
        location={locationMock}
        match={{ params: { id: '001' }, path: 'path', url: 'url' }}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('TitleReceiveContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    TitleReceive.mockClear();
    historyMock.push.mockClear();

    useTitleHydratedPieces.mockReturnValue({
      title: mockTitle,
      pieces: mockPieces,
      orderLine: mockPoLine,
      isLoading: false,
      locations: mockLocations,
      holdings: mockHoldings,
    });

    useHoldingsAbandonmentAnalyzer.mockReturnValue({
      analyzerFactory: mockAnalyzerFactory,
      isLoading: false,
    });

    useDeleteHoldingsModal.mockReturnValue({
      initDeleteHoldingsModal: mockInitDeleteHoldingsModal,
      modal: mockDeleteHoldingsModal,
    });

    getHoldingsAbandonmentCheckData.mockReturnValue({
      holdingIds: [],
      pieceIds: [],
      incoming: {},
    });

    mockAnalyze.mockResolvedValue([]);
    mockAnalyzerFactory.mockResolvedValue({ analyze: mockAnalyze });
  });

  it('should render loading', async () => {
    useTitleHydratedPieces.mockClear().mockReturnValue({
      title: {},
      pieces: [],
      orderLine: {},
      locations: [],
      isLoading: true,
    });
    renderTitleReceiveContainer();

    expect(screen.getByText('LoadingPane')).toBeInTheDocument();
  });

  it('should render component', async () => {
    renderTitleReceiveContainer();

    expect(screen.getByText('TitleReceive')).toBeInTheDocument();
  });

  it('should redirect to title details when receive is cancelled', async () => {
    renderTitleReceiveContainer();

    TitleReceive.mock.calls[0][0].onCancel();

    expect(historyMock.push).toHaveBeenCalled();
  });

  it('should receive pieces', async () => {
    const receiveMock = jest.fn().mockReturnValue(Promise.resolve());

    useReceive.mockClear().mockReturnValue({ receive: receiveMock });

    renderTitleReceiveContainer();

    const mockForm = {
      getState: jest.fn().mockReturnValue({
        values: { receivedItems: [{ checked: true, isCreateItem: true }] },
        initialValues: { receivedItems: [{ holdingId: 'holding-1' }] },
      }),
    };

    await TitleReceive.mock.calls[0][0].onSubmit(
      { receivedItems: [{ checked: true, isCreateItem: true }] },
      mockForm,
    );

    expect(receiveMock).toHaveBeenCalled();
  });

  describe('Holdings abandonment check', () => {
    it('should skip holdings abandonment check when no holdings to check', async () => {
      const receiveMock = jest.fn().mockResolvedValue();

      useReceive.mockReturnValue({ receive: receiveMock });

      getHoldingsAbandonmentCheckData.mockReturnValue({
        holdingIds: [],
        pieceIds: [],
        incoming: {},
      });

      renderTitleReceiveContainer();

      const mockForm = {
        getState: jest.fn().mockReturnValue({
          values: { receivedItems: [{ checked: true, id: 'piece-1' }] },
          initialValues: { receivedItems: [{ holdingId: 'holding-1' }] },
        }),
      };

      await TitleReceive.mock.calls[0][0].onSubmit(
        { receivedItems: [{ checked: true, id: 'piece-1' }] },
        mockForm,
      );

      expect(mockAnalyzerFactory).not.toHaveBeenCalled();
      expect(mockInitDeleteHoldingsModal).not.toHaveBeenCalled();
      expect(receiveMock).toHaveBeenCalledWith({
        pieces: expect.any(Array),
        deleteHoldings: false,
      });
    });

    it('should perform holdings abandonment check when holdings changed', async () => {
      const receiveMock = jest.fn().mockResolvedValue();

      useReceive.mockReturnValue({ receive: receiveMock });

      getHoldingsAbandonmentCheckData.mockReturnValue({
        holdingIds: ['holding-1'],
        pieceIds: ['piece-1'],
        incoming: { 'holding-2': ['piece-1'] },
      });

      mockAnalyze.mockResolvedValue([]);

      renderTitleReceiveContainer();

      const mockForm = {
        getState: jest.fn().mockReturnValue({
          values: { receivedItems: [{ checked: true, id: 'piece-1', holdingId: 'holding-2' }] },
          initialValues: { receivedItems: [{ holdingId: 'holding-1' }] },
        }),
      };

      await TitleReceive.mock.calls[0][0].onSubmit(
        { receivedItems: [{ checked: true, id: 'piece-1', holdingId: 'holding-2' }] },
        mockForm,
      );

      await waitFor(() => {
        expect(mockAnalyzerFactory).toHaveBeenCalledWith({
          holdingIds: ['holding-1'],
          signal: expect.any(AbortSignal),
        });
      });

      expect(mockAnalyze).toHaveBeenCalledWith({
        explain: true,
        holdingIds: ['holding-1'],
        ids: ['piece-1'],
        incoming: { 'holding-2': ['piece-1'] },
        strategy: 'PIECE',
      });
      expect(mockInitDeleteHoldingsModal).not.toHaveBeenCalled();
      expect(receiveMock).toHaveBeenCalled();
    });

    it('should show delete holdings modal when holdings will be abandoned', async () => {
      const receiveMock = jest.fn().mockResolvedValue();

      useReceive.mockReturnValue({ receive: receiveMock });

      getHoldingsAbandonmentCheckData.mockReturnValue({
        holdingIds: ['holding-1'],
        pieceIds: ['piece-1'],
        incoming: { 'holding-2': ['piece-1'] },
      });

      mockAnalyze.mockResolvedValue([
        { id: 'holding-1', abandoned: true },
      ]);

      mockInitDeleteHoldingsModal.mockResolvedValue(true);

      renderTitleReceiveContainer();

      const mockForm = {
        getState: jest.fn().mockReturnValue({
          values: { receivedItems: [{ checked: true, id: 'piece-1', holdingId: 'holding-2' }] },
          initialValues: { receivedItems: [{ holdingId: 'holding-1' }] },
        }),
      };

      await TitleReceive.mock.calls[0][0].onSubmit(
        { receivedItems: [{ checked: true, id: 'piece-1', holdingId: 'holding-2' }] },
        mockForm,
      );

      await waitFor(() => {
        expect(mockInitDeleteHoldingsModal).toHaveBeenCalledWith(
          [{ id: 'holding-1', abandoned: true }],
          mockHoldings,
          mockLocations,
        );
      });

      expect(receiveMock).toHaveBeenCalledWith({
        pieces: expect.any(Array),
        deleteHoldings: true,
      });
    });

    it('should receive with deleteHoldings=false when user chooses to keep holdings', async () => {
      const receiveMock = jest.fn().mockResolvedValue();

      useReceive.mockReturnValue({ receive: receiveMock });

      getHoldingsAbandonmentCheckData.mockReturnValue({
        holdingIds: ['holding-1'],
        pieceIds: ['piece-1'],
        incoming: { 'holding-2': ['piece-1'] },
      });

      mockAnalyze.mockResolvedValue([
        { id: 'holding-1', abandoned: true },
      ]);

      mockInitDeleteHoldingsModal.mockResolvedValue(false);

      renderTitleReceiveContainer();

      const mockForm = {
        getState: jest.fn().mockReturnValue({
          values: { receivedItems: [{ checked: true, id: 'piece-1', holdingId: 'holding-2' }] },
          initialValues: { receivedItems: [{ holdingId: 'holding-1' }] },
        }),
      };

      await TitleReceive.mock.calls[0][0].onSubmit(
        { receivedItems: [{ checked: true, id: 'piece-1', holdingId: 'holding-2' }] },
        mockForm,
      );

      await waitFor(() => {
        expect(mockInitDeleteHoldingsModal).toHaveBeenCalled();
      });

      expect(receiveMock).toHaveBeenCalledWith({
        pieces: expect.any(Array),
        deleteHoldings: false,
      });
    });

    it('should not receive when user cancels the delete holdings modal', async () => {
      const receiveMock = jest.fn().mockResolvedValue();

      useReceive.mockReturnValue({ receive: receiveMock });

      getHoldingsAbandonmentCheckData.mockReturnValue({
        holdingIds: ['holding-1'],
        pieceIds: ['piece-1'],
        incoming: { 'holding-2': ['piece-1'] },
      });

      mockAnalyze.mockResolvedValue([
        { id: 'holding-1', abandoned: true },
      ]);

      mockInitDeleteHoldingsModal.mockRejectedValue();

      renderTitleReceiveContainer();

      const mockForm = {
        getState: jest.fn().mockReturnValue({
          values: { receivedItems: [{ checked: true, id: 'piece-1', holdingId: 'holding-2' }] },
          initialValues: { receivedItems: [{ holdingId: 'holding-1' }] },
        }),
      };

      await TitleReceive.mock.calls[0][0].onSubmit(
        { receivedItems: [{ checked: true, id: 'piece-1', holdingId: 'holding-2' }] },
        mockForm,
      );

      await waitFor(() => {
        expect(mockInitDeleteHoldingsModal).toHaveBeenCalled();
      });

      expect(receiveMock).not.toHaveBeenCalled();
    });

    it('should filter out non-abandoned holdings from analysis result', async () => {
      const receiveMock = jest.fn().mockResolvedValue();

      useReceive.mockReturnValue({ receive: receiveMock });

      getHoldingsAbandonmentCheckData.mockReturnValue({
        holdingIds: ['holding-1', 'holding-2'],
        pieceIds: ['piece-1', 'piece-2'],
        incoming: { 'holding-3': ['piece-1', 'piece-2'] },
      });

      mockAnalyze.mockResolvedValue([
        { id: 'holding-1', abandoned: true },
        { id: 'holding-2', abandoned: false },
      ]);

      mockInitDeleteHoldingsModal.mockResolvedValue(true);

      renderTitleReceiveContainer();

      const mockForm = {
        getState: jest.fn().mockReturnValue({
          values: {
            receivedItems: [
              { checked: true, id: 'piece-1', holdingId: 'holding-3' },
              { checked: true, id: 'piece-2', holdingId: 'holding-3' },
            ],
          },
          initialValues: {
            receivedItems: [
              { holdingId: 'holding-1' },
              { holdingId: 'holding-2' },
            ],
          },
        }),
      };

      await TitleReceive.mock.calls[0][0].onSubmit(
        {
          receivedItems: [
            { checked: true, id: 'piece-1', holdingId: 'holding-3' },
            { checked: true, id: 'piece-2', holdingId: 'holding-3' },
          ],
        },
        mockForm,
      );

      await waitFor(() => {
        expect(mockInitDeleteHoldingsModal).toHaveBeenCalledWith(
          [{ id: 'holding-1', abandoned: true }],
          mockHoldings,
          mockLocations,
        );
      });
    });
  });

  it('should show loading state when analyzer is loading', () => {
    useHoldingsAbandonmentAnalyzer.mockReturnValue({
      analyzerFactory: mockAnalyzerFactory,
      isLoading: true,
    });

    renderTitleReceiveContainer();

    const titleReceiveProps = TitleReceive.mock.calls[0][0];

    expect(titleReceiveProps.isLoading).toBe(true);
  });

  it('should render delete holdings modal', () => {
    const mockModal = <div>Delete Holdings Modal</div>;

    useDeleteHoldingsModal.mockReturnValue({
      initDeleteHoldingsModal: mockInitDeleteHoldingsModal,
      modal: mockModal,
    });

    const { container } = renderTitleReceiveContainer();

    expect(container).toBeTruthy();
  });
});
