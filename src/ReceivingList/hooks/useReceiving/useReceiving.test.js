import queryString from 'query-string';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { useLocation } from 'react-router';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import { NO_DST_TIMEZONES } from '@folio/stripes-acq-components/test/jest/fixtures';

import { useReceiving } from './useReceiving';
import { FILTERS } from '../../constants';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn(),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: () => ['namespace'],
  useOkapiKy: jest.fn(),
  useStripes: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const titles = [{ poLineId: '3e1a947f-a605-41b8-839c-7929f02ef911' }];

const kyMock = {
  extend: () => kyMock,
  get: jest.fn(() => ({
    json: () => ({
      titles,
      totalRecords: titles.length,
    }),
  })),
};

const renderTestHook = (...args) => renderHook(() => useReceiving(...args), { wrapper });
const waitForLoading = async (result) => waitFor(() => expect(result.current.isFetching).toBeFalsy());

describe('useReceiving', () => {
  beforeEach(() => {
    useLocation.mockReturnValue({ search: '' });
    useOkapiKy.mockReturnValue(kyMock);
    useStripes.mockReturnValue({ timezone: NO_DST_TIMEZONES.UTC });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty list if there no filters were passed in the query', async () => {
    const { result } = renderTestHook({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
    });

    await waitForLoading(result);

    expect(result.current).toEqual({
      titles: [],
      totalRecords: 0,
      isFetching: false,
    });
  });

  it('should return fetched hydrated receivings list', async () => {
    useLocation.mockReturnValue({ search: 'purchaseOrder.workflowStatus=Open' });

    const fetchReferences = jest.fn().mockReturnValue(Promise.resolve({
      orderLinesMap: { [titles[0].poLineId]: { id: titles[0].poLineId } },
    }));
    const { result } = renderTestHook({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
      fetchReferences,
    });

    await waitForLoading(result);

    expect(result.current).toEqual(expect.objectContaining({
      titles: [{
        poLine: {
          id: titles[0].poLineId,
        },
        poLineId: titles[0].poLineId,
      }],
      totalRecords: 1,
      isFetching: false,
    }));
  });

  describe('Datetime filters', () => {
    const dateTimeConfig = {
      from: '2025-01-01',
      to: '2025-12-31',
    };

    const expectedResultsDict = {
      [NO_DST_TIMEZONES.AFRICA_DAKAR]: {
        start: '2025-01-01T00:00:00.000',
        end: '2025-12-31T23:59:59.999',
      },
      [NO_DST_TIMEZONES.AMERICA_BOGOTA]: {
        start: '2025-01-01T05:00:00.000',
        end: '2026-01-01T04:59:59.999',
      },
      [NO_DST_TIMEZONES.ASIA_DUBAI]: {
        start: '2024-12-31T20:00:00.000',
        end: '2025-12-31T19:59:59.999',
      },
      [NO_DST_TIMEZONES.ASIA_SHANGHAI]: {
        start: '2024-12-31T16:00:00.000',
        end: '2025-12-31T15:59:59.999',
      },
      [NO_DST_TIMEZONES.ASIA_TOKIO]: {
        start: '2024-12-31T15:00:00.000',
        end: '2025-12-31T14:59:59.999',
      },
      [NO_DST_TIMEZONES.EUROPE_MOSCOW]: {
        start: '2024-12-31T21:00:00.000',
        end: '2025-12-31T20:59:59.999',
      },
      [NO_DST_TIMEZONES.PACIFIC_TAHITI]: {
        start: '2025-01-01T10:00:00.000',
        end: '2026-01-01T09:59:59.999',
      },
      [NO_DST_TIMEZONES.UTC]: {
        start: '2025-01-01T00:00:00.000',
        end: '2025-12-31T23:59:59.999',
      },
    };

    const datetimeFilters = [
      FILTERS.DATE_CREATED,
      FILTERS.DATE_UPDATED,
      FILTERS.PIECE_DATE_CREATED,
      FILTERS.PIECE_DATE_UPDATED,
    ];

    const dateFilters = [
      FILTERS.EXPECTED_RECEIPT_DATE,
      FILTERS.RECEIVED_DATE,
      FILTERS.RECEIPT_DUE,
    ];

    describe.each(Object.values(datetimeFilters))('Datetime range filter: %s', (filter) => {
      it.each(Object.keys(expectedResultsDict))('should properly apply filter for the timezone - %s', async (timezone) => {
        const search = queryString.stringify({
          [filter]: [dateTimeConfig.from, dateTimeConfig.to].join(':'),
        });

        useLocation.mockReturnValue({ search });
        useStripes.mockReturnValue({ timezone });

        const { start, end } = expectedResultsDict[timezone];

        renderTestHook({ pagination: { limit: 5, offset: 0, timestamp: 42 } });

        expect(kyMock.get.mock.calls[0][1].searchParams.query).toContain(`(${filter}>="${start}" and ${filter}<="${end}")`);
      });
    });

    describe.each(Object.values(dateFilters))('Date range filter: %s', (filter) => {
      it.each(Object.keys(expectedResultsDict))('should properly apply filter for the timezone - %s', async (timezone) => {
        const search = queryString.stringify({
          [filter]: [dateTimeConfig.from, dateTimeConfig.to].join(':'),
        });

        useLocation.mockReturnValue({ search });
        useStripes.mockReturnValue({ timezone });

        renderTestHook({ pagination: { limit: 5, offset: 0, timestamp: 42 } });

        expect(kyMock.get.mock.calls[0][1].searchParams.query).toContain(`(${filter}>="${dateTimeConfig.from}T00:00:00.000" and ${filter}<="${dateTimeConfig.to}T23:59:59.999")`);
      });
    });
  });
});
