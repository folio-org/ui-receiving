import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import {
  HOLDINGS_API,
  ITEMS_API,
  LOCATIONS_API,
  PIECE_STATUS,
  useOrderLine,
} from '@folio/stripes-acq-components';
import { orderLine } from '@folio/stripes-acq-components/test/jest/fixtures';

import { PIECE_REQUESTS_API } from '../../constants';
import { usePieces } from '../usePieces';
import { useTitle } from '../useTitle';
import { useTitleHydratedPieces } from './useTitleHydratedPieces';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useOrderLine: jest.fn(),
}));
jest.mock('../usePieces', () => ({ usePieces: jest.fn() }));
jest.mock('../useTitle', () => ({ useTitle: jest.fn() }));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const title = { id: 'title-id' };
const items = [
  { id: 'item-id-1' },
  { id: 'item-id-2' },
];
const requests = [
  {
    id: 'request-id-1',
    itemId: items[0].id,
  },
  {
    id: 'request-id-1',
    itemId: items[1].id,
  },
];
const locations = [
  { id: 'locationId' },
];
const holdings = [
  {
    id: 'holdingId',
    permanentLocationId: locations[0].id,
  },
];
const pieces = [
  {
    id: 'piece-id-1',
    itemId: items[0].id,
    holdingId: holdings[0].id,
  },
  {
    id: 'piece-id-2',
    itemId: items[1].id,
    locationId: locations[0].id,
  },
];

const kyResponseMap = {
  [PIECE_REQUESTS_API]: { requests },
  [ITEMS_API]: { items },
  [HOLDINGS_API]: { holdingsRecords: holdings },
  [LOCATIONS_API]: { locations },
};

describe('useTitleHydratedPieces', () => {
  const getMock = jest.fn((api) => ({
    json: () => Promise.resolve(kyResponseMap[api]),
  }));

  beforeEach(() => {
    useOrderLine
      .mockClear()
      .mockReturnValue({ orderLine });
    usePieces
      .mockClear()
      .mockReturnValue({ pieces });
    useTitle
      .mockClear()
      .mockReturnValue({ title });
    useOkapiKy
      .mockClear()
      .mockReturnValue({ get: getMock });
  });

  it('fetches hydrated pieces', async () => {
    const { result } = renderHook(() => useTitleHydratedPieces({
      titleId: title.id,
      receivingStatus: PIECE_STATUS.unreceivable,
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.pieces).toHaveLength(pieces.length);
  });
});
