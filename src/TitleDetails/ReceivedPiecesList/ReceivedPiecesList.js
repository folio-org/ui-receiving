import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  PIECE_STATUS,
} from '@folio/stripes-acq-components';

import { usePaginatedPieces } from '../../common/hooks';

import { PIECE_COLUMNS } from '../constants';
import PiecesList from '../PiecesList';

const RESULT_COUNT_INCREMENT = 30;

const ReceivedPiecesList = ({
  filters,
  onLoadingStatusChange,
  title,
  selectPiece,
  visibleColumns,
}) => {
  const [sorting, setSorting] = useState({
    sorting: 'receivedDate',
    sortingDirection: 'descending',
  });
  const [pagination, setPagination] = useState({ limit: RESULT_COUNT_INCREMENT });
  const {
    pieces,
    totalRecords,
    isFetching,
  } = usePaginatedPieces({
    pagination,
    queryParams: {
      titleId: title.id,
      poLineId: title.poLineId,
      receivingStatus: PIECE_STATUS.received,
      ...filters,
      ...sorting,
    },
  });

  useEffect(() => {
    setPagination(prev => ({ ...prev, offset: 0, timestamp: new Date() }));
  }, [filters, setPagination]);

  useEffect(() => {
    onLoadingStatusChange(isFetching);
  }, [isFetching, onLoadingStatusChange]);

  return (
    <PiecesList
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

ReceivedPiecesList.propTypes = {
  filters: PropTypes.object.isRequired,
  onLoadingStatusChange: PropTypes.func.isRequired,
  title: PropTypes.object.isRequired,
  selectPiece: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ReceivedPiecesList;
