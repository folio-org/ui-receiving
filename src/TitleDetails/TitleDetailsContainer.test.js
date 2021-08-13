import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import TitleDetailsContainer from './TitleDetailsContainer';
import TitleDetails from './TitleDetails';

jest.mock('./TitleDetails', () => jest.fn().mockReturnValue('TitleDetails'));

const resourcesMock = { configLoanType: { records: [{ value: 'loanType' }] } };
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
  holdings: {
    GET: jest.fn(),
  },
  configLoanType: {
    GET: jest.fn(),
  },
  loanTypes: {
    GET: jest.fn().mockReturnValue(Promise.resolve([])),
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

const renderTitleDetailsContainer = () => (render(
  <MemoryRouter>
    <TitleDetailsContainer
      history={historyMock}
      location={locationMock}
      match={{ params: { id: 'titleId' }, path: 'path', url: 'url' }}
      mutator={mutator}
      resources={resourcesMock}
    />
  </MemoryRouter>,
));

describe('TitleDetailsContainer', () => {
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
    expect(mutator.loanTypes.GET).toHaveBeenCalled();
  });

  // it('should redirect to title list when create is cancelled', async () => {
  //   historyMock.push.mockClear();
  //   await act(async () => renderTitleDetailsContainer());

  //   TitleDetails.mock.calls[0][0].onEdit();

  //   console.log(TitleDetails.mock.calls[0]);

  //   expect(screen.getByText('TitleDetails')).toBeDefined();
  //   expect(historyMock.push).toHaveBeenCalled();
  // });

  // // it('should save title', async () => {
  // //   mutatorMock.titles.POST.mockReturnValue(Promise.resolve({}));

  // //   await act(async () => renderTitleFormContainer());

  // //   TitleForm.mock.calls[0][0].onSubmit({});

  // //   expect(mutatorMock.titles.POST).toHaveBeenCalled();
  // // });
});
