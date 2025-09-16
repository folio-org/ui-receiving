import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import {
  PIECE_STATUS,
  useInstanceHoldingsQuery,
  useLocationsQuery,
} from '@folio/stripes-acq-components';

import { usePaginatedPieces } from '../../../common/hooks';
import { usePiecesList } from './usePiecesList';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useInstanceHoldingsQuery: jest.fn(),
  useLocationsQuery: jest.fn(),
}));

jest.mock('../../../common/hooks', () => ({
  ...jest.requireActual('../../../common/hooks'),
  usePaginatedPieces: jest.fn(),
}));

const locations = [{ id: 'locId', name: 'locName' }];
const holdings = [{ id: 'holdingId', permanentLocationId: 'locId' }];
const pieces = [{ id: 'id', holdingId: 'holdingId' }];
const paginatedPieces = {
  pieces,
  totalRecords: pieces.length,
  isFetching: false,
};
const hookParams = {
  filters: { query: '2022' },
  initialSorting: {
    sorting: 'name',
    sortingDirection: 'ascending',
  },
  onLoadingStatusChange: jest.fn(),
  queryParams: { receivingStatus: PIECE_STATUS.expected },
  title: {
    id: 'titleId',
    poLineId: 'poLineId',
  },
};

describe('usePiecesList', () => {
  beforeEach(() => {
    useInstanceHoldingsQuery.mockReturnValue({ holdings });
    useLocationsQuery.mockReturnValue({ locations });
    usePaginatedPieces.mockReturnValue(paginatedPieces);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return fetched pieces with pagination details', async () => {
    const { result } = renderHook(() => usePiecesList(hookParams));

    expect(result.current.pieces).toEqual(pieces.map((piece) => ({
      ...piece,
      locationName: 'locName',
    })));
    expect(result.current.pagination).toBeDefined();
  });
});
