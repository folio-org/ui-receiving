import React from 'react';
import { act, render } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  usePieceMutator,
  useQuickReceive,
} from '../common/hooks';
import TitleDetails from './TitleDetails';
import TitleDetailsContainer from './TitleDetailsContainer';

jest.mock('../common/hooks', () => ({
  usePieceMutator: jest.fn().mockReturnValue({}),
  useQuickReceive: jest.fn().mockReturnValue({}),
  useUnreceive: jest.fn().mockReturnValue({}),
}));
jest.mock('./TitleDetails', () => jest.fn().mockReturnValue('TitleDetails'));

const queryClient = new QueryClient();
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
const mutator = {
  title: {
    GET: jest.fn().mockReturnValue(Promise.resolve(title)),
  },
  poLine: {
    GET: jest.fn().mockReturnValue(Promise.resolve(poLine)),
  },
  purchaseOrder: {
    GET: jest.fn().mockReturnValue(Promise.resolve(purchaseOrder)),
  },
  pieces: {
    GET: jest.fn().mockReturnValue(Promise.resolve(pieces)),
  },
  items: {
    GET: jest.fn(),
  },
  requests: {
    GET: jest.fn(),
  },
  locations: {
    GET: jest.fn().mockReturnValue(Promise.resolve(locations)),
    reset: jest.fn(),
  },
  vendors: {
    GET: jest.fn().mockReturnValue(Promise.resolve(vendors)),
    reset: jest.fn(),
  },
};

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const renderTitleDetailsContainer = () => render(
  <TitleDetailsContainer
    history={historyMock}
    location={locationMock}
    match={{ params: { id: 'titleId' }, path: 'path', url: 'url' }}
    mutator={mutator}
  />,
  { wrapper },
);

describe('TitleDetailsContainer', () => {
  beforeEach(() => {
    TitleDetails.mockClear();
  });

  it('should load all data', async () => {
    await act(async () => {
      renderTitleDetailsContainer();
    });

    expect(mutator.title.GET).toHaveBeenCalled();
    expect(mutator.purchaseOrder.GET).toHaveBeenCalled();
    expect(mutator.pieces.GET).toHaveBeenCalled();
    expect(mutator.poLine.GET).toHaveBeenCalled();
    expect(mutator.locations.GET).toHaveBeenCalled();
    expect(mutator.vendors.GET).toHaveBeenCalled();
  });

  it('should mutate piece when onAdd is called', async () => {
    const mutatePieceMock = jest.fn().mockReturnValue(Promise.resolve());

    usePieceMutator.mockClear().mockReturnValue({ mutatePiece: mutatePieceMock });

    await act(async () => {
      renderTitleDetailsContainer();
    });

    await TitleDetails.mock.calls[0][0].onAddPiece(pieces[0]);

    expect(mutatePieceMock).toHaveBeenCalled();
  });

  it('should receive piece when onCheckIn is called', async () => {
    const quickReceiveMock = jest.fn().mockReturnValue(Promise.resolve());

    useQuickReceive.mockClear().mockReturnValue({ quickReceive: quickReceiveMock });

    await act(async () => {
      renderTitleDetailsContainer();
    });

    await TitleDetails.mock.calls[0][0].onCheckIn(pieces[0]);

    expect(quickReceiveMock).toHaveBeenCalled();
  });

  it('should fetch items and pieces in holding', async () => {
    await act(async () => {
      renderTitleDetailsContainer();
    });

    TitleDetails.mock.calls[0][0].getHoldingsItemsAndPieces('holdingId');

    expect(mutator.pieces.GET).toHaveBeenCalled();
    expect(mutator.items.GET).toHaveBeenCalled();
  });
});
