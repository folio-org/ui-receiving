import React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import '@folio/stripes-acq-components/test/jest/__mock__';

import TitleDetailsContainer from './TitleDetailsContainer';

jest.mock('./TitleDetails', () => {
  return () => <span>TitleDetails</span>;
});

const renderTitleDetailsContainer = (mutator) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <TitleDetailsContainer
        history={{}}
        location={{}}
        match={{ params: { id: '001' } }}
        mutator={mutator}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('TitleDetailsContainer', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      title: {
        GET: jest.fn(),
      },
      poLine: {
        GET: jest.fn(),
      },
      purchaseOrder: {
        GET: jest.fn(),
      },
      pieces: {
        GET: jest.fn(),
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
        GET: jest.fn(),
      },
      locations: {
        GET: jest.fn(),
        reset: jest.fn(),
      },
      vendors: {
        GET: jest.fn(),
        reset: jest.fn(),
      },
    };
  });

  afterEach(cleanup);

  it('should load all data', async () => {
    const title = { title: 'Title', id: 'titleId', poLineId: 'poLineId' };
    const purchaseOrder = { id: 'orderId', orderType: 'Ongoing', vendor: 'vendorId' };
    const pieces = [{ id: 'pieceId', locationId: 'locationId', poLineId: 'poLineId' }];
    const locations = [{ id: 'locationId' }];
    const vendors = [{ id: 'vendorId', name: 'vendorName' }];
    const poLine = { id: 'poLineId', purchaseOrderId: 'orderId', locations: [{ locationId: 'locationId' }] };

    mutator.title.GET.mockReturnValue(Promise.resolve(title));
    mutator.purchaseOrder.GET.mockReturnValue(Promise.resolve(purchaseOrder));
    mutator.poLine.GET.mockReturnValue(Promise.resolve(poLine));
    mutator.pieces.GET.mockReturnValue(Promise.resolve(pieces));
    mutator.locations.GET.mockReturnValue(Promise.resolve(locations));
    mutator.vendors.GET.mockReturnValue(Promise.resolve(vendors));

    await act(async () => {
      renderTitleDetailsContainer(mutator);
    });

    expect(mutator.title.GET).toHaveBeenCalled();
    expect(mutator.purchaseOrder.GET).toHaveBeenCalled();
    expect(mutator.pieces.GET).toHaveBeenCalled();
    expect(mutator.poLine.GET).toHaveBeenCalled();
    expect(mutator.locations.GET).toHaveBeenCalled();
    expect(mutator.vendors.GET).toHaveBeenCalled();
  });
});
