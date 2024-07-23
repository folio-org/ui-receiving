import keyBy from 'lodash/keyBy';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  HOLDINGS_API,
  LOCATIONS_API,
  batchFetch,
  useOrderLine,
} from '@folio/stripes-acq-components';

import { useReceivingSearchContext } from '../../../contexts';
import { getHydratedPieces } from '../../utils';
import {
  usePieceItemsFetch,
  usePieceRequestsFetch,
} from '../usePaginatedPieces/hooks';
import { usePieces } from '../usePieces';
import { useTitle } from '../useTitle';

export const useTitleHydratedPieces = ({
  receivingStatus,
  tenantId,
  titleId,
  searchQuery = '',
} = {}) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace('receiving-title-hydrated-pieces');

  const { crossTenant } = useReceivingSearchContext();

  const {
    title,
    isLoading: isTitleLoading,
  } = useTitle(titleId, { tenantId });

  const {
    orderLine,
    isLoading: isOrderLineLoading,
  } = useOrderLine(title?.poLineId, { tenantId });

  const {
    pieces,
    isLoading: isPiecesLoading,
  } = usePieces(
    {
      tenantId,
      searchParams: {
        query: `titleId=${titleId} and poLineId==${orderLine?.id} and receivingStatus==${receivingStatus}` + (searchQuery ? ` and ${searchQuery}` : ''),
      },
    },
    { enabled: Boolean(titleId && orderLine?.id && receivingStatus) },
  );

  const { fetchPieceItems } = usePieceItemsFetch({
    instanceId: title?.instanceId,
    tenantId,
  });

  const { fetchPieceRequests } = usePieceRequestsFetch({ tenantId });

  const isReferenceDataLoading = (
    isTitleLoading
    || isOrderLineLoading
    || isPiecesLoading
  );

  const queryFn = async ({ signal }) => {
    const mutatorAdapter = (api, recordsKey) => ({
      GET: ({ params: searchParams }) => {
        return ky.get(api, { searchParams, signal })
          .json()
          .then((response) => response[recordsKey]);
      },
    });

    const hydratedPieces = await getHydratedPieces({
      pieces,
      fetchPieceItems,
      fetchPieceRequests,
      crossTenant,
    });

    const holdingIds = hydratedPieces.map(({ holdingId }) => holdingId).filter(Boolean);
    const locationIds = hydratedPieces.map(({ locationId }) => locationId).filter(Boolean);

    const holdings = holdingIds.length
      ? await batchFetch(mutatorAdapter(HOLDINGS_API, 'holdingsRecords'), holdingIds)
      : [];

    const holdingLocationIds = holdings.map(({ permanentLocationId }) => permanentLocationId);
    const holdingLocations = await batchFetch(mutatorAdapter(LOCATIONS_API, 'locations'), [...new Set([...holdingLocationIds, ...locationIds])]);

    return {
      holdingLocations,
      pieces: hydratedPieces,
      pieceLocationMap: keyBy(holdingLocations, 'id'),
      pieceHoldingMap: keyBy(holdings, 'id'),
    };
  };

  const { data, isLoading } = useQuery({
    queryKey: [namespace, pieces],
    queryFn,
    enabled: !isReferenceDataLoading && Boolean(pieces?.length),
  });

  return {
    isLoading: isLoading || isReferenceDataLoading,
    orderLine,
    pieces: data?.pieces,
    holdingLocations: data?.holdingLocations,
    title,
    pieceLocationMap: data?.pieceLocationMap,
    pieceHoldingMap: data?.pieceHoldingMap,
  };
};
