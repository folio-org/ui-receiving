import escapeRegExp from 'lodash/escapeRegExp';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

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

import { usePaginatedPieces } from '../common/hooks';
import {
  RECEIVING_PIECE_CREATE_ROUTE,
  RECEIVING_PIECE_EDIT_ROUTE,
} from '../constants';
import TitleDetails from './TitleDetails';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  withRouter: jest.fn((component) => component),
}));
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
  location: locationMock,
  history: historyMock,
  match: matchMock,
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const renderTitleDetails = (props = {}) => render(
  <TitleDetails
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('TitleDetails', () => {
  beforeEach(() => {
    historyMock.push.mockClear();
    usePaginatedPieces.mockClear().mockReturnValue({
      pieces: defaultProps.pieces,
      totalCount: defaultProps.pieces.length,
      isFetching: false,
    });
  });

  it('should display title details accordions', () => {
    renderTitleDetails();

    expect(screen.getByText('ui-receiving.title.information')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.title.polDetails')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.title.expected')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.title.received')).toBeInTheDocument();
  });

  it('should navigate to piece create form', async () => {
    renderTitleDetails();

    await user.click(await screen.findByTestId('add-piece-button'));

    expect(historyMock.push).toHaveBeenCalledWith(expect.objectContaining({
      pathname: expect.stringMatching(new RegExp(
        escapeRegExp(RECEIVING_PIECE_CREATE_ROUTE)
          .replace(':id', defaultProps.title.id),
      )),
    }));
  });

  it('should navigate to piece edit form', async () => {
    renderTitleDetails();

    const pieceRow = await screen.findAllByRole('row');

    await user.click(pieceRow[1]);

    expect(historyMock.push).toHaveBeenCalledWith(expect.objectContaining({
      pathname: expect.stringMatching(new RegExp(
        escapeRegExp(RECEIVING_PIECE_EDIT_ROUTE)
          .replace(':id', defaultProps.title.id)
          .replace(':pieceId', '.*'),
      )),
    }));
  });

  it('should display filter search inputs if there are pieces to receive/unreceive', async () => {
    const piecesExistence = {
      [PIECE_STATUS.expected]: true,
      [PIECE_STATUS.received]: true,
    };

    renderTitleDetails({ piecesExistence });

    expect(screen.getAllByTestId('filter-search-input')).toBeDefined();
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
