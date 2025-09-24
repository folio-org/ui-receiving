import PropTypes from 'prop-types';

import { Loading } from '@folio/stripes/components';
import {
  DESC_DIRECTION,
  PIECE_STATUS,
} from '@folio/stripes-acq-components';

import { PIECE_FORM_FIELD_NAMES } from '../../common/constants';
import { usePiecesList } from '../hooks';
import PiecesList from '../PiecesList';

const initialSorting = {
  sorting: PIECE_FORM_FIELD_NAMES.sequenceNumber,
  sortingDirection: DESC_DIRECTION,
};

const ReceivedPiecesList = ({
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
    queryParams: { receivingStatus: PIECE_STATUS.received },
  });

  if (isLoading) return <Loading />;

  return (
    <PiecesList
      applySorting={setSorting}
      columnIdPrefix="received-pieces"
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

ReceivedPiecesList.propTypes = {
  filters: PropTypes.object.isRequired,
  onLoadingStatusChange: PropTypes.func.isRequired,
  title: PropTypes.object.isRequired,
  selectPiece: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ReceivedPiecesList;
