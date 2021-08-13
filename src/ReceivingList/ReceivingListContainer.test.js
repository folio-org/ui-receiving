import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import queryString from 'query-string';

import {
  useList,
} from '@folio/stripes-acq-components';

import ReceivingList from './ReceivingList';
import ReceivingListContainer from './ReceivingListContainer';
import { buildTitlesQuery } from './utils';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useList: jest.fn().mockReturnValue({}),
}));
jest.mock('./ReceivingList', () => jest.fn().mockReturnValue('ReceivingList'));

const defaultProps = {
  mutator: {
    receivingListTitles: {
      GET: jest.fn().mockReturnValue(Promise.resolve([])),
    },
    receivingListOrderLines: {
      GET: jest.fn().mockReturnValue(Promise.resolve([{ purchaseOrderId: 'orderId', locations: [{ locationId: 'id' }] }])),
    },
    lineOrders: {
      GET: jest.fn().mockReturnValue(Promise.resolve([{ id: 'orderId' }])),
    },
    receivingListLocations: {
      GET: jest.fn().mockReturnValue(Promise.resolve([{ id: 'id' }])),
    },
  },
  location: {},
  history: {},
};

const renderReceivingListContainer = (props = defaultProps) => render(
  <ReceivingListContainer {...props} />,
  { wrapper: MemoryRouter },
);

describe('ReceivingListContainer', () => {
  beforeEach(() => {
    defaultProps.mutator.receivingListTitles.GET.mockClear();
  });

  it('should display Receiving list', async () => {
    await act(async () => renderReceivingListContainer());

    expect(screen.getByText('ReceivingList')).toBeDefined();
  });

  it('should pass useList result to ReceivingList', () => {
    const records = [{ id: 'titleId' }];

    ReceivingList.mockClear();
    useList.mockClear().mockReturnValue({ records });
    renderReceivingListContainer();

    expect(ReceivingList.mock.calls[0][0].titles).toBe(records);
  });

  it('should load titles in useList', () => {
    defaultProps.mutator.receivingListTitles.GET.mockClear();
    useList.mockClear();

    renderReceivingListContainer();

    useList.mock.calls[0][1](5);

    expect(defaultProps.mutator.receivingListTitles.GET).toHaveBeenCalledWith({
      params: {
        limit: 30,
        offset: 5,
        query: '(cql.allRecords=1) sortby title/sort.ascending',
      },
    });
  });

  it('should load title poLines in useList', async () => {
    defaultProps.mutator.receivingListOrderLines.GET.mockClear();
    useList.mockClear();

    renderReceivingListContainer();

    await act(async () => {
      await useList.mock.calls[0][2](jest.fn(), { titles: [{ poLineId: 'id' }] });
    });

    expect(defaultProps.mutator.receivingListOrderLines.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: 'id==id',
      },
    });
  });

  describe('search query', () => {
    it('should build query when search is active', () => {
      const expectedQuery = '((title=="*query*" or poLine.titleOrPackage=="*query*" or productIds=="*query*" or purchaseOrder.poNumber=="*query*" or poLine.poLineNumber=="*query*" or poLine.vendorDetail.referenceNumbers=="*query*")) sortby title/sort.ascending';

      expect(buildTitlesQuery(queryString.parse('?query=query'))).toBe(expectedQuery);
    });

    it('should build query when search by field is active', () => {
      const expectedQuery = '(((title==*title*))) sortby title/sort.ascending';

      expect(buildTitlesQuery(queryString.parse('?qindex=title&query=title'))).toBe(expectedQuery);
    });
  });
});
