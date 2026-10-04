import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { usePagination } from '@folio/stripes-acq-components';

import { useReceiving } from './hooks';
import ReceivingListContainer from './ReceivingListContainer';
import {
  fetchConsortiumOrderLineHoldings,
  fetchConsortiumOrderLineLocations,
  fetchLinesOrders,
  fetchOrderLineHoldings,
  fetchOrderLineLocations,
  fetchOrdersVendors,
  fetchTitleOrderLines,
} from './utils';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  usePagination: jest.fn(() => ({})),
}));
jest.mock('./ReceivingList', () => jest.fn().mockReturnValue('ReceivingList'));
jest.mock('./hooks/useReceiving', () => ({
  useReceiving: jest.fn(),
}));
jest.mock('./utils', () => ({
  fetchConsortiumOrderLineHoldings: jest.fn(),
  fetchConsortiumOrderLineLocations: jest.fn(),
  fetchLinesOrders: jest.fn(),
  fetchOrderLineHoldings: jest.fn(),
  fetchOrderLineLocations: jest.fn(),
  fetchOrdersVendors: jest.fn(),
  fetchTitleOrderLines: jest.fn(),
  LIST_IGNORED_QUERY_PARAMS: ['layer'],
}));

const renderReceivingListContainer = (props = {}) => render(
  <ReceivingListContainer
    {...props}
  />,
);

describe('ReceivingListContainer', () => {
  const titles = [{
    id: '81f3f271-e6be-4ea1-93cd-edee96cc2227',
    title: 'Multi-line titles #2',
    poLineId: '3e1a947f-a605-41b8-839c-7929f02ef911',
  }];
  const vendor = {
    id: 'e0fb5df2-cdf1-11e8-a8d5-f2801f1b9fd1',
    name: 'Amazon.com',
  };
  const order = {
    id: '17d5d47c-19a4-4ba0-b6bf-2b8f5e6c4e11',
    vendor: vendor.id,
    workflowStatus: 'Open',
  };
  const location = {
    id: '758258bc-ecc1-41b8-abca-f7b610822ffd',
    name: 'Main Library',
  };
  const orderLine = {
    id: titles[0].poLineId,
    purchaseOrderId: order.id,
    locations: [{ locationId: location.id }],
  };

  beforeEach(() => {
    fetchConsortiumOrderLineHoldings
      .mockClear()
      .mockReturnValue(() => []);
    fetchConsortiumOrderLineLocations
      .mockClear()
      .mockReturnValue(() => []);
    fetchLinesOrders
      .mockClear()
      .mockReturnValue([]);
    fetchOrderLineHoldings
      .mockClear()
      .mockReturnValue(() => []);
    fetchOrderLineLocations
      .mockClear()
      .mockReturnValue(() => []);
    fetchOrdersVendors
      .mockClear()
      .mockReturnValue([]);
    fetchTitleOrderLines
      .mockClear()
      .mockReturnValue([]);
    useReceiving
      .mockClear()
      .mockReturnValue({ titles, totalRecords: titles.length });
  });

  it('should display Receiving list', () => {
    renderReceivingListContainer();

    expect(screen.getByText('ReceivingList')).toBeDefined();
    expect(usePagination).toHaveBeenCalledWith(
      expect.any(Object),
      { ignoredSearchParams: ['layer'] },
    );
  });

  it('should load order lines, orders and receiving locations when fetchReferences is called', async () => {
    renderReceivingListContainer();

    await waitFor(() => useReceiving.mock.calls[0][0].fetchReferences(titles));

    expect(fetchTitleOrderLines).toHaveBeenCalled();
    expect(fetchLinesOrders).toHaveBeenCalled();
    expect(fetchOrderLineLocations).toHaveBeenCalled();
  });

  it('should resolve vendor and location names of the fetched order lines', async () => {
    fetchTitleOrderLines.mockReturnValue([orderLine]);
    fetchOrderLineLocations.mockReturnValue(() => [location]);
    fetchLinesOrders.mockReturnValue([order]);
    fetchOrdersVendors.mockReturnValue([vendor]);

    renderReceivingListContainer();

    const { orderLinesMap } = await useReceiving.mock.calls[0][0].fetchReferences(titles);

    expect(orderLinesMap[orderLine.id]).toEqual(expect.objectContaining({
      locations: [location.name],
      vendor: vendor.name,
    }));
  });
});
