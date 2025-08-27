import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import {
  getConsortiumCentralTenantId,
  makeQueryBuilder,
  ORDER_PIECES_API,
  useLocaleDateFormat,
} from '@folio/stripes-acq-components';

import { getPieceStatusFromItem } from '../../utils';
import {
  usePieceItemsFetch,
  usePieceRequestsFetch,
} from './hooks';
import { makeKeywordQueryBuilder } from './searchConfigs';

export const buildPiecesQuery = dateFormat => makeQueryBuilder(
  'cql.allRecords=1',
  makeKeywordQueryBuilder(dateFormat),
  'sortby receiptDate',
);

export const usePaginatedPieces = ({
  pagination,
  queryParams = {},
  options = {},
}) => {
  const {
    crossTenant,
    enabled = true,
    tenantId,
    activeTenantId,
    centralTenantId,
  } = options;

  const stripes = useStripes();
  const ky = useOkapiKy({ tenant: tenantId });

  const { fetchPieceRequests } = usePieceRequestsFetch({ tenantId });
  const { fetchPieceItems } = usePieceItemsFetch({
    tenantId: crossTenant ? getConsortiumCentralTenantId(stripes) : tenantId,
  });

  const [namespace] = useNamespace({ key: `${queryParams.receivingStatus}-pieces-list` });
  const localeDateFormat = useLocaleDateFormat();

  const query = buildPiecesQuery(localeDateFormat)(queryParams);

  const searchParams = {
    query,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const queryKey = [namespace, pagination.timestamp, pagination.limit, pagination.offset];
  const queryFn = async ({ signal }) => {
    const { pieces, totalRecords } = await ky
      .get(ORDER_PIECES_API, { searchParams, signal })
      .json();

    const [requests, items] = await Promise.all([
      fetchPieceRequests({ pieces, signal }),
      fetchPieceItems({ pieces, crossTenant, signal }),
    ]);

    const itemsMap = items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
    const requestsMap = requests.reduce((acc, r) => ({ ...acc, [r.itemId]: r }), {});

    return {
      totalRecords,
      pieces: pieces
        .filter(piece => {
          if (crossTenant && activeTenantId !== centralTenantId) {
            return activeTenantId === piece.receivingTenantId;
          }

          return true;
        })
        .map((piece) => ({
          ...piece,
          itemId: itemsMap[piece.itemId] ? piece.itemId : undefined,
          callNumber: itemsMap[piece.itemId]?.itemLevelCallNumber,
          itemStatus: getPieceStatusFromItem(itemsMap[piece.itemId]),
          request: requestsMap[piece.itemId],
          holdingsRecordId: itemsMap[piece.itemId]?.holdingsRecordId,
        })),
    };
  };
  const defaultOptions = {
    enabled: enabled && Boolean(pagination.timestamp),
    keepPreviousData: true,
  };

  const { isFetching, data } = useQuery({
    queryKey,
    queryFn,
    ...defaultOptions,
  });

  return ({
    ...data,
    isFetching,
  });
};
