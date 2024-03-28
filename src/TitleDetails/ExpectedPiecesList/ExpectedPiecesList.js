import PropTypes from 'prop-types';

import {
  EXPECTED_PIECES_STATUSES,
  PIECE_COLUMNS,
} from '../constants';
import {
  usePiecesList,
} from '../hooks';
import PiecesList from '../PiecesList';

const ExpectedPiecesList = ({
  filters,
  onLoadingStatusChange,
  title,
  selectPiece,
  visibleColumns,
}) => {
  const initialSorting = {
    sorting: 'receiptDate',
    sortingDirection: 'ascending',
  };

  const {
    isFetching,
    pagination,
    pieces,
    setPagination,
    setSorting,
    totalRecords,
  } = usePiecesList({
    filters,
    initialSorting,
    onLoadingStatusChange,
    title,
    queryParams: { receivingStatus: EXPECTED_PIECES_STATUSES },
  });

  return (
    <PiecesList
      columnIdPrefix="expected-pieces"
      pieces={pieces}
      isLoading={isFetching}
      totalCount={totalRecords}
      selectPiece={selectPiece}
      visibleColumns={visibleColumns}
      sortedColumn={PIECE_COLUMNS.receiptDate}
      pagination={pagination}
      onNeedMoreData={setPagination}
      applySorting={setSorting}
    />
  );
};

ExpectedPiecesList.propTypes = {
  filters: PropTypes.object.isRequired,
  onLoadingStatusChange: PropTypes.func.isRequired,
  title: PropTypes.object.isRequired,
  selectPiece: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ExpectedPiecesList;
