import React from 'react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';
import {
  PIECE_STATUS, PIECE_FORMAT,
  INVENTORY_RECORDS_TYPE,
  ORDER_FORMATS,
  ORDER_STATUSES,
} from '@folio/stripes-acq-components';

import { usePaginatedPieces } from '../common/hooks';

import TitleDetails from './TitleDetails';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FieldInventory: jest.fn().mockReturnValue('FieldInventory'),
  RoutingListAccordion: jest.fn().mockReturnValue('RoutingListAccordion'),
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
}));
jest.mock('./TitleInformation', () => jest.fn().mockReturnValue('TitleInformation'));
jest.mock('./ReceivedPiecesList', () => jest.fn().mockReturnValue('ReceivedPiecesList'));
jest.mock('./Title', () => jest.fn().mockReturnValue('Title'));
jest.mock('./POLDetails', () => jest.fn().mockReturnValue('POLDetails'));
jest.mock('../common/components', () => ({
  ...jest.requireActual('../common/components'),
  LineLocationsView: jest.fn().mockReturnValue('LineLocationsView'),
}));
jest.mock('../common/hooks', () => ({
  ...jest.requireActual('../common/hooks'),
  usePaginatedPieces: jest.fn(),
}));

const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
  location: locationMock,
};
const matchMock = { params: { id: 'titleId' }, path: 'path', url: 'url' };
const defaultProps = {
  order: {},
  pieces: [{
    id: 'id',
    receivingStatus: PIECE_STATUS.expected,
    titleId: 'titleId',
    format: PIECE_FORMAT.electronic,
    poLineId: 'poLineId',
  }],
  poLine: {
    id: 'poLineId',
    locations: [{ locationId: 'id', name: 'locationName', code: 'locationCode' }],
    eresource: { createInventory: INVENTORY_RECORDS_TYPE.instance },
    physical: { createInventory: INVENTORY_RECORDS_TYPE.instance },
    orderFormat: ORDER_FORMATS.PEMix,
  },
  title: { id: 'titleId', instanceId: null },
  vendorsMap: {},
  locations: [{ id: 'locationId', name: 'locationName', code: 'locationCode' }],
  onEdit: jest.fn(),
  onClose: jest.fn(),
  onCheckIn: jest.fn(() => Promise.resolve({})),
  onAddPiece: jest.fn(() => Promise.resolve({})),
  deletePiece: jest.fn(),
  location: locationMock,
  history: historyMock,
  match: matchMock,
  getHoldingsItemsAndPieces: jest.fn(),
  getPieceValues: jest.fn(() => Promise.resolve({})),
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const renderTitleDetails = (props = {}) => (render(
  <TitleDetails
    {...defaultProps}
    {...props}
  />,
  { wrapper },
));

describe('TitleDetails', () => {
  beforeEach(() => {
    usePaginatedPieces.mockClear().mockReturnValue({
      pieces: defaultProps.pieces,
      totalCount: defaultProps.pieces.length,
      isFetching: false,
    });
  });

  it('should display title details accordions', async () => {
    await act(async () => renderTitleDetails());

    expect(screen.getByText('ui-receiving.title.information')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.polDetails')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.expected')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.received')).toBeDefined();
  });

  it('should open piece modal and stay on title details', async () => {
    renderTitleDetails();

    const pieceRow = await screen.findAllByRole('row');

    await user.click(pieceRow[1]);
    expect(screen.getByText('Title')).toBeDefined();
  });

  it('should display filter search inputs if there are pieces to receive/unreceive', async () => {
    const piecesExistence = {
      [PIECE_STATUS.expected]: true,
      [PIECE_STATUS.received]: true,
    };

    renderTitleDetails({ piecesExistence });

    expect(screen.getAllByTestId('filter-search-input')).toBeDefined();
  });

  describe('AddPieceModal', () => {
    it('should call \'onAddPiece\' when \'Save\' button was clicked', async () => {
      renderTitleDetails();

      const pieceRow = await screen.findAllByRole('row');

      await user.click(pieceRow[1]);

      const formatSelection = await screen.findByRole('combobox', {
        name: 'ui-receiving.piece.format',
      });

      const saveBtn = await screen.findByRole('button', {
        name: 'stripes-components.saveAndClose',
      });

      user.selectOptions(formatSelection, ['Electronic']);
      await user.click(saveBtn);

      expect(defaultProps.onAddPiece).toHaveBeenCalled();
    });

    it('should call \'onCheckIn\' when \'Quick receive\' button was clicked', async () => {
      renderTitleDetails();

      const pieceRow = await screen.findAllByRole('row');

      await user.click(pieceRow[1]);

      const formatSelection = await screen.findByRole('combobox', {
        name: 'ui-receiving.piece.format',
      });

      user.selectOptions(formatSelection, ['Electronic']);

      const quickReceiveBtn = await screen.findByTestId('quickReceive');

      await user.click(quickReceiveBtn);

      expect(defaultProps.onCheckIn).toHaveBeenCalled();
    });

    it('should call \'onCheckIn\' when \'Quick receive\' button was clicked and user confirm action', async () => {
      renderTitleDetails({
        order: { workflowStatus: ORDER_STATUSES.closed },
      });

      const pieceRow = await screen.findAllByRole('row');

      await user.click(pieceRow[1]);

      const formatSelection = await screen.findByRole('combobox', {
        name: 'ui-receiving.piece.format',
      });

      const quickReceiveBtn = await screen.findByTestId('quickReceive');

      user.selectOptions(formatSelection, ['Electronic']);
      await user.click(quickReceiveBtn);

      const confirmBtn = await screen.findByRole('button', {
        name: 'ui-receiving.piece.actions.confirm',
      });

      await user.click(confirmBtn);
      expect(defaultProps.onCheckIn).toHaveBeenCalled();
    });
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
      historyMock.push.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', async () => {
      await act(async () => renderTitleDetails());

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', async () => {
      await act(async () => renderTitleDetails());

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should navigate to edit view when edit shortcut is called', async () => {
      await act(async () => renderTitleDetails());

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'edit').handler();

      expect(defaultProps.onEdit).toHaveBeenCalled();
    });
  });
});
