import { MemoryRouter } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useLocationsQuery,
  useOrderLine,
} from '@folio/stripes-acq-components';
import { useOkapiKy } from '@folio/stripes/core';

import {
  useOrder,
  useOrganizationsBatch,
  useTitle,
} from '../common/hooks';
import { RECEIVING_ROUTE } from '../constants';
import { useReceivingSearchContext } from '../contexts';
import TitleDetails from './TitleDetails';
import TitleDetailsContainer from './TitleDetailsContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useLocationsQuery: jest.fn(),
  useOrderLine: jest.fn(),
}));
jest.mock('../common/hooks', () => ({
  useOrder: jest.fn(),
  useOrganizationsBatch: jest.fn(),
  useTitle: jest.fn(),
}));
jest.mock('./TitleDetails', () => jest.fn().mockReturnValue('TitleDetails'));

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
const title = { title: 'Title', id: 'titleId', poLineId: 'poLineId' };
const purchaseOrder = { id: 'orderId', orderType: 'Ongoing', vendor: 'vendorId' };
const pieces = [{ id: 'pieceId', locationId: 'locationId', poLineId: 'poLineId' }];
const locations = [{ id: 'locationId' }];
const vendors = [{ id: 'vendorId', name: 'vendorName' }];
const poLine = { id: 'poLineId', purchaseOrderId: 'orderId', locations: [{ locationId: 'locationId' }] };

const receivingContextMock = {
  isCentralOrderingEnabled: false,
  isCentralRouting: false,
  targetTenantId: 'tenantId',
};

const kyMock = {
  extend: () => kyMock,
  get: jest.fn(() => ({
    json: () => Promise.resolve({ pieces }),
  })),
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const defaultProps = {
  history: historyMock,
  location: locationMock,
  match: {
    params: { id: 'titleId' },
    path: 'path',
    url: 'url',
  },
  tenantId: 'tenantId',
};

const renderTitleDetailsContainer = (props = {}) => render(
  <TitleDetailsContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('TitleDetailsContainer', () => {
  beforeEach(() => {
    historyMock.push.mockClear();
    TitleDetails.mockClear();
    useLocationsQuery
      .mockClear()
      .mockReturnValue({ locations });
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
    useOrder
      .mockClear()
      .mockReturnValue({ order: purchaseOrder });
    useOrderLine
      .mockClear()
      .mockImplementationOnce((_, { onSuccess } = {}) => {
        onSuccess?.(poLine);

        return { orderLine: poLine };
      })
      .mockReturnValue({ orderLine: poLine });
    useOrganizationsBatch
      .mockClear()
      .mockImplementationOnce((_, { onSuccess } = {}) => {
        onSuccess?.(vendors);

        return vendors;
      })
      .mockReturnValue(vendors);
    useReceivingSearchContext
      .mockClear()
      .mockReturnValue(receivingContextMock);
    useTitle
      .mockClear()
      .mockReturnValue({ title });
  });

  it('should render title details', () => {
    renderTitleDetailsContainer();

    expect(screen.getByText('TitleDetails')).toBeInTheDocument();
  });

  it('should close title details pane', async () => {
    renderTitleDetailsContainer();

    await act(async () => TitleDetails.mock.calls[0][0].onClose());

    expect(historyMock.push).toHaveBeenCalledWith(expect.objectContaining({ pathname: RECEIVING_ROUTE }));
  });

  it('should navigate to the title edit form', async () => {
    renderTitleDetailsContainer();

    await act(async () => TitleDetails.mock.calls[0][0].onEdit());

    expect(historyMock.push).toHaveBeenCalledWith(expect.objectContaining({ pathname: `${RECEIVING_ROUTE}/${title.id}/edit` }));
  });
});
