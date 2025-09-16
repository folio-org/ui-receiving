import noop from 'lodash/noop';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getHoldingLocationName,
  useInstanceHoldingsQuery,
  useLocationsQuery,
} from '@folio/stripes-acq-components';

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
    centralTenantId,
    activeTenantId,
  } = useReceivingSearchContext();

  const [sorting, setSorting] = useState(initialSorting);
  const [pagination, setPagination] = useState({ limit });

  const {
    isLoading: isLocationsLoading,
    locations,
  } = useLocationsQuery({ consortium: crossTenant });

  const {
    holdings,
    isLoading: isHoldingsLoading,
  } = useInstanceHoldingsQuery(title?.instanceId, { consortium: crossTenant });

  const {
    isFetching,
    isLoading: isPiecesLoading,
    pieces: paginatedPieces,
    totalRecords,
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
      activeTenantId,
      centralTenantId,
      crossTenant,
      instanceId: title?.instanceId,
      tenantId: targetTenantId,
    },
  });

  const isLoading = isPiecesLoading || isLocationsLoading || isHoldingsLoading;

  useEffect(() => {
    setPagination(prev => ({ ...prev, offset: 0, timestamp: new Date() }));
  }, [filters]);

  useEffect(() => {
    onLoadingStatusChange(isFetching || isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, isLoading]);

  const pieces = useMemo(() => {
    const holdingsMap = new Map(holdings?.map(holding => [holding.id, holding]));
    const locationsMap = new Map(locations?.map(location => [location.id, location]));

    return paginatedPieces.map(piece => {
      const locationName = piece.holdingId
        ? getHoldingLocationName(holdingsMap.get(piece.holdingId), Object.fromEntries(locationsMap.entries()))
        : null;

      return {
        ...piece,
        locationName,
      };
    });
  }, [paginatedPieces, holdings, locations]);

  return {
    isFetching,
    isLoading,
    pagination,
    pieces,
    sorting,
    setPagination,
    setSorting,
    totalRecords,
  };
};
