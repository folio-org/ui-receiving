import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';
import { ASC_DIRECTION } from '@folio/stripes-acq-components';

import { PIECE_FORM_FIELD_NAMES } from '../../common/constants';
import { EXPECTED_PIECES_STATUSES } from '../../Piece';
import { usePiecesList } from '../hooks';
import PiecesList from '../PiecesList';

const initialSorting = {
  sorting: PIECE_FORM_FIELD_NAMES.sequenceNumber,
  sortingDirection: ASC_DIRECTION,
};

const ExpectedPiecesList = ({
  filters,
  onLoadingStatusChange,
  title,
  selectPiece,
  visibleColumns,
}) => {
  const {
    isFetching,
    isLoading,
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

  if (isLoading) return <Loading />;

  return (
    <PiecesList
      applySorting={setSorting}
      columnIdPrefix="expected-pieces"
      initialSorting={initialSorting}
      isLoading={isFetching}
      onNeedMoreData={setPagination}
      pagination={pagination}
      pieces={pieces}
      selectPiece={selectPiece}
      totalCount={totalRecords}
      visibleColumns={visibleColumns}
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
