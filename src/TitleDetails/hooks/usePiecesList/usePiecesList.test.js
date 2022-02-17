import { renderHook } from '@testing-library/react-hooks';

import { PIECE_STATUS } from '@folio/stripes-acq-components';

import { usePaginatedPieces } from '../../../common/hooks';
import { usePiecesList } from './usePiecesList';

jest.mock('../../../common/hooks', () => ({
  ...jest.requireActual('../../../common/hooks'),
  usePaginatedPieces: jest.fn(),
}));

const pieces = [{ id: 'id' }];
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
    usePaginatedPieces.mockClear().mockReturnValue(paginatedPieces);
  });

  it('should return fetched pieces with pagination details', async () => {
    const { result } = renderHook(() => usePiecesList(hookParams));

    expect(result.current.pieces).toEqual(pieces);
    expect(result.current.pagination).toBeDefined();
  });
});
