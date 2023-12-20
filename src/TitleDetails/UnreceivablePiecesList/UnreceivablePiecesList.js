import PropTypes from 'prop-types';

import { PIECE_STATUS } from '@folio/stripes-acq-components';

import { PIECE_COLUMNS } from '../constants';
import { usePiecesList } from '../hooks';
import PiecesList from '../PiecesList';

export const UnreceivablePiecesList = ({
  filters,
  onLoadingStatusChange,
  title,
  selectPiece,
  visibleColumns,
}) => {
  const initialSorting = {
    sorting: 'receivedDate',
    sortingDirection: 'descending',
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
    queryParams: { receivingStatus: PIECE_STATUS.unreceivable },
  });

  return (
    <PiecesList
      columnIdPrefix="unreceivable-pieces"
      pieces={pieces}
      isLoading={isFetching}
      totalCount={totalRecords}
      selectPiece={selectPiece}
      visibleColumns={visibleColumns}
      sortedColumn={PIECE_COLUMNS.receivedDate}
      pagination={pagination}
      onNeedMoreData={setPagination}
      applySorting={setSorting}
    />
  );
};

UnreceivablePiecesList.propTypes = {
  filters: PropTypes.object.isRequired,
  onLoadingStatusChange: PropTypes.func.isRequired,
  title: PropTypes.object.isRequired,
  selectPiece: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};
