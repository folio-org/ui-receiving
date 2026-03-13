import keyBy from 'lodash/keyBy';
import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';
import {
  CQL_AND_OPERATOR,
  useOrderLine,
  useLocationsQuery,
  useInstanceHoldingsQuery,
} from '@folio/stripes-acq-components';

import { useReceivingSearchContext } from '../../../contexts';
import {
  getCentralOrderingReceivingTenantId,
  getHydratedPieces,
} from '../../utils';
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

  const {
    activeTenantId,
    centralTenantId,
    crossTenant,
  } = useReceivingSearchContext();

  const receivingTenantId = getCentralOrderingReceivingTenantId({
    activeTenantId,
    centralTenantId,
    crossTenant,
  });

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
    piecesCount,
    isLoading: isPiecesLoading,
  } = usePieces(
    {
      tenantId,
      searchParams: {
        query: [
          `titleId=${titleId}`,
          `poLineId==${orderLine?.id}`,
          `receivingStatus==${receivingStatus}`,
          receivingTenantId && `receivingTenantId==${receivingTenantId}`,
          searchQuery,
        ]
          .filter(Boolean)
          .join(` ${CQL_AND_OPERATOR} `),
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
        crossTenant,
        fetchPieceItems,
        fetchPieceRequests,
        pieces,
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
    piecesCount,
    title,
  };
};
