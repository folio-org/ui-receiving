import { useEffect, useState } from 'react';
import { noop } from 'lodash';

import { usePaginatedPieces } from '../../../common/hooks';

const RESULT_COUNT_INCREMENT = 30;

export const usePiecesList = ({
  filters = {},
  initialSorting,
  limit = RESULT_COUNT_INCREMENT,
  onLoadingStatusChange = noop,
  queryParams = {},
  title,
}) => {
  const [sorting, setSorting] = useState(initialSorting);
  const [pagination, setPagination] = useState({ limit });
  const {
    pieces,
    totalRecords,
    isFetching,
  } = usePaginatedPieces({
    pagination,
    queryParams: {
      titleId: title?.id,
      poLineId: title?.poLineId,
      ...queryParams,
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

  return {
    isFetching,
    pagination,
    pieces,
    sorting,
    setPagination,
    setSorting,
    totalRecords,
  };
};
