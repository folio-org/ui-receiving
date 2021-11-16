import React from 'react';
import user from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';
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
} from '@folio/stripes-acq-components';

import TitleDetails from './TitleDetails';
import { TitleDetailsExpectedActions } from './TitleDetailsActions';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FieldInventory: jest.fn().mockReturnValue('FieldInventory'),
}));
jest.mock('./TitleInformation', () => jest.fn().mockReturnValue('TitleInformation'));
jest.mock('./ReceivedPiecesList', () => jest.fn().mockReturnValue('ReceivedPiecesList'));
jest.mock('./TitleDetailsActions', () => ({
  TitleDetailsExpectedActions: jest.fn().mockReturnValue('TitleDetailsExpectedActions'),
  TitleDetailsReceivedActions: jest.fn().mockReturnValue('TitleDetailsReceivedActions'),
}));
jest.mock('./Title', () => jest.fn().mockReturnValue('Title'));
jest.mock('./POLDetails', () => jest.fn().mockReturnValue('POLDetails'));
jest.mock('../common/components', () => ({
  ...jest.requireActual('../common/components'),
  LineLocationsView: jest.fn().mockReturnValue('LineLocationsView'),
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
  title: { instanceId: null },
  vendorsMap: {},
  locations: [{ id: 'locationId', name: 'locationName', code: 'locationCode' }],
  onEdit: jest.fn(),
  onClose: jest.fn(),
  onCheckIn: jest.fn().mockReturnValue({
    then: () => ({
      then: (fn) => fn(),
    }),
  }),
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

const renderTitleDetails = (props = defaultProps) => (render(
  <TitleDetails
    {...props}
  />,
  { wrapper },
));

describe('TitleDetails', () => {
  it('should display title details accordions', async () => {
    await act(async () => renderTitleDetails());

    expect(screen.getByText('ui-receiving.title.information')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.polDetails')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.expected')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.received')).toBeDefined();
  });

  it('should open add piece modal and stay on title details', async () => {
    await act(async () => renderTitleDetails());

    await act(async () => TitleDetailsExpectedActions.mock.calls[0][0].openAddPieceModal());

    expect(screen.getByText('Title')).toBeDefined();
  });

  describe('AddPieceModal', () => {
    it('should call \'onAddPiece\' when \'Save\' button was clicked', async () => {
      renderTitleDetails();

      const pieceRow = await screen.findAllByRole('row');

      user.click(pieceRow[1]);

      const createAnotherCheckbox = await screen.findByRole('checkbox', {
        name: 'ui-receiving.piece.actions.createAnother',
      });
      const formatSelection = await screen.findByRole('combobox', {
        name: 'ui-receiving.piece.format',
      });

      user.click(createAnotherCheckbox);

      const saveBtn = await screen.findByRole('button', {
        name: 'stripes-core.button.save',
      });

      user.selectOptions(formatSelection, ['Electronic']);
      user.click(saveBtn);

      expect(defaultProps.onAddPiece).toHaveBeenCalled();
    });

    it('should call \'onCheckIn\' when \'Quick receive\' button was clicked', async () => {
      renderTitleDetails();

      const pieceRow = await screen.findAllByRole('row');

      user.click(pieceRow[1]);

      const createAnotherCheckbox = await screen.findByRole('checkbox', {
        name: 'ui-receiving.piece.actions.createAnother',
      });
      const formatSelection = await screen.findByRole('combobox', {
        name: 'ui-receiving.piece.format',
      });

      user.click(createAnotherCheckbox);

      const quickReceiveBtn = await screen.findByRole('button', {
        name: 'ui-receiving.piece.actions.quickReceive',
      });

      user.selectOptions(formatSelection, ['Electronic']);
      user.click(quickReceiveBtn);

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
