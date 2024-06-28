import {
  useEffect,
  useState,
} from 'react';
import noop from 'lodash/noop';

import { usePaginatedPieces } from '../../../common/hooks';
import { useReceivingSearchContext } from '../../../contexts';

const RESULT_COUNT_INCREMENT = 30;

export const usePiecesList = ({
  filters = {},
  initialSorting,
  limit = RESULT_COUNT_INCREMENT,
  onLoadingStatusChange = noop,
  queryParams = {},
  title,
}) => {
  const {
    crossTenant,
    targetTenantId,
  } = useReceivingSearchContext();

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
    options: {
      crossTenant,
      instanceId: title?.instanceId,
      tenantId: targetTenantId,
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
