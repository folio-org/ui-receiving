import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  PIECE_STATUS,
} from '@folio/stripes-acq-components';

import { usePaginatedPieces } from '../../common/hooks';

import {
  PIECE_COLUMNS,
} from '../constants';
import PiecesList from '../PiecesList';

const RESULT_COUNT_INCREMENT = 30;

const ExpectedPiecesList = ({
  filters,
  onLoadingStatusChange,
  title,
  selectPiece,
  visibleColumns,
}) => {
  const [sorting, setSorting] = useState({
    sorting: 'receiptDate',
    sortingDirection: 'ascending',
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
      receivingStatus: PIECE_STATUS.expected,
      ...filters,
      ...sorting,
    },
  });

  useEffect(() => {
    setPagination(prev => ({ ...prev, offset: 0, timestamp: new Date() }));
  }, [filters]);

  useEffect(() => {
    onLoadingStatusChange(isFetching);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  return (
    <PiecesList
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
