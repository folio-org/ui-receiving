import keyBy from 'lodash/keyBy';
import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';
import {
  useOrderLine,
  useLocationsQuery,
  useInstanceHoldingsQuery,
} from '@folio/stripes-acq-components';

import { useReceivingSearchContext } from '../../../contexts';
import { getHydratedPieces } from '../../utils';
import {
  usePieceItemsFetch,
  usePieceRequestsFetch,
} from '../usePaginatedPieces/hooks';
import { usePieces } from '../usePieces';
import { useTitle } from '../useTitle';

const DEFAULT_DATA = [];

export const useTitleHydratedPieces = ({
  receivingStatus,
  tenantId,
  titleId,
  searchQuery = '',
} = {}) => {
  const [namespace] = useNamespace({ key: 'title-hydrated-pieces' });

  const { activeTenantId, crossTenant, centralTenantId } = useReceivingSearchContext();

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
        query: `titleId=${titleId} and poLineId==${orderLine?.id} and receivingStatus==${receivingStatus}` + (searchQuery ? ` and ${searchQuery}` : '') + ' sortby receiptDate',
      },
    },
    { enabled: Boolean(titleId && orderLine?.id && receivingStatus) },
  );

  const { fetchPieceItems } = usePieceItemsFetch({
    instanceId: title?.instanceId,
    tenantId,
  });
  const { fetchPieceRequests } = usePieceRequestsFetch({ tenantId });

  const {
    isLoading: isLocationsLoading,
    locations,
  } = useLocationsQuery({ consortium: crossTenant });

  const {
    holdings,
    isLoading: isHoldingsLoading,
  } = useInstanceHoldingsQuery(title?.instanceId, { consortium: crossTenant });

  const isReferenceDataLoading = (
    isTitleLoading
    || isOrderLineLoading
    || isPiecesLoading
    || isLocationsLoading
    || isHoldingsLoading
  );

  const { data, isLoading } = useQuery({
    queryKey: [namespace, pieces, receivingStatus, tenantId, titleId],
    queryFn: async () => {
      const hydratedPieces = await getHydratedPieces({
        pieces,
        fetchPieceItems,
        fetchPieceRequests,
        activeTenantId,
        crossTenant,
        centralTenantId,
      });

      return {
        pieces: hydratedPieces,
      };
    },
    enabled: !isReferenceDataLoading && Boolean(pieces?.length),
  });

  return {
    holdings,
    isLoading: isLoading || isReferenceDataLoading,
    locations,
    orderLine,
    pieceHoldingMap: keyBy(holdings, 'id'),
    pieceLocationMap: keyBy(locations, 'id'),
    pieces: data?.pieces || DEFAULT_DATA,
    title,
  };
};
