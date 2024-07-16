import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  ITEM_STATUS,
  ITEMS_API,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

import { PIECE_REQUESTS_API } from '../../constants';
import {
  usePieceItemsFetch,
  usePieceRequestsFetch,
} from './hooks';
import { usePaginatedPieces } from './usePaginatedPieces';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: () => ['namespace'],
  useOkapiKy: jest.fn(),
}));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  usePieceItemsFetch: jest.fn(),
  usePieceRequestsFetch: jest.fn(),
}));
jest.mock('./util', () => ({
  ...jest.requireActual('./util'),
  fetchConsortiumPieceItems: jest.fn(),
  fetchLocalPieceItems: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const item = {
  id: 'itemId',
  itemLevelCallNumber: '1-32',
  barcode: '23421',
  holdingsRecordId: 'holdingsRecordId',
  status: { name: ITEM_STATUS.inProcess },
};
const request = {
  id: 'requestId',
  itemId: item.id,
};
const pieces = [{
  id: 'pieceId',
  itemId: item.id,
}];

const KY_RESPONSE_DATA_MAP = {
  [ORDER_PIECES_API]: {
    pieces,
    totalRecords: pieces.length,
  },
  [ITEMS_API]: {
    items: [item],
  },
  [PIECE_REQUESTS_API]: {
    requests: [request],
  },
};

const fetchPieceItems = jest.fn(() => [item]);
const fetchPieceRequests = jest.fn(() => [request]);

describe('usePaginatedPieces', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: path => ({
          json: () => KY_RESPONSE_DATA_MAP[path],
        }),
      });
    usePieceItemsFetch
      .mockClear()
      .mockReturnValue({ fetchPieceItems });
    usePieceRequestsFetch
      .mockClear()
      .mockReturnValue({ fetchPieceRequests });
  });

  it('should return fetched hydrated pieces', async () => {
    const { result } = renderHook(() => usePaginatedPieces({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
    }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current).toEqual({
      pieces: [{
        ...pieces[0],
        itemId: item.id,
        callNumber: item.itemLevelCallNumber,
        itemStatus: item.status.name,
        request,
        holdingsRecordId: item.holdingsRecordId,
      }],
      totalRecords: 1,
      isFetching: false,
    });
  });
});
