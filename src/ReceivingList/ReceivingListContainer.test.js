import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import ReceivingListContainer from './ReceivingListContainer';
import { useReceiving } from './hooks';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  usePagination: () => ({}),
}));
jest.mock('./ReceivingList', () => jest.fn().mockReturnValue('ReceivingList'));
jest.mock('./hooks/useReceiving', () => ({
  useReceiving: jest.fn(),
}));

const defaultProps = {
  mutator: {
    receivingListOrderLines: {
      GET: jest.fn().mockReturnValue(
        Promise.resolve([{ purchaseOrderId: 'orderId', locations: [{ locationId: 'locationId' }] }]),
      ),
    },
    lineOrders: {
      GET: jest.fn().mockReturnValue(Promise.resolve([{ id: 'orderId' }])),
    },
    receivingListLocations: {
      GET: jest.fn().mockReturnValue(Promise.resolve([{ id: 'locationId' }])),
    },
  },
};

const renderReceivingListContainer = (props = {}) => render(
  <ReceivingListContainer
    {...defaultProps}
    {...props}
  />,
);

describe('ReceivingListContainer', () => {
  const titles = [{
    id: '81f3f271-e6be-4ea1-93cd-edee96cc2227',
    title: 'Multi-line titles #2',
    poLineId: '3e1a947f-a605-41b8-839c-7929f02ef911',
  }];

  beforeEach(() => {
    useReceiving
      .mockClear()
      .mockReturnValue({ titles, totalRecords: titles.length });
  });

  it('should display Receiving list', () => {
    renderReceivingListContainer();

    expect(screen.getByText('ReceivingList')).toBeDefined();
  });

  it('should load order lines, orders and receiving locations when fetchReferences is called', async () => {
    renderReceivingListContainer();

    await waitFor(() => useReceiving.mock.calls[0][0].fetchReferences(titles));

    expect(defaultProps.mutator.receivingListOrderLines.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: `id==${titles[0].poLineId}`,
      },
    });

    expect(defaultProps.mutator.lineOrders.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: 'id==orderId',
      },
    });

    expect(defaultProps.mutator.receivingListLocations.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: 'id==locationId',
      },
    });
  });
});
