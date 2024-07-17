import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import { useReceiving } from './hooks';
import ReceivingListContainer from './ReceivingListContainer';
import {
  fetchConsortiumOrderLineHoldings,
  fetchConsortiumOrderLineLocations,
  fetchLinesOrders,
  fetchOrderLineHoldings,
  fetchOrderLineLocations,
  fetchTitleOrderLines,
} from './utils';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  usePagination: () => ({}),
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
  fetchTitleOrderLines: jest.fn(),
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
  });

  it('should load order lines, orders and receiving locations when fetchReferences is called', async () => {
    renderReceivingListContainer();

    await waitFor(() => useReceiving.mock.calls[0][0].fetchReferences(titles));

    expect(fetchTitleOrderLines).toHaveBeenCalled();
    expect(fetchLinesOrders).toHaveBeenCalled();
    expect(fetchOrderLineLocations).toHaveBeenCalled();
  });
});
