import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import {
  batchRequest,
  getConsortiumCentralTenantId,
  makeQueryBuilder,
  ORDER_PIECES_API,
  REQUESTS_API,
  useLocaleDateFormat,
} from '@folio/stripes-acq-components';

import { getPieceStatusFromItem } from '../../utils';
import { makeKeywordQueryBuilder } from './searchConfigs';
import {
  fetchConsortiumPieceItems,
  fetchLocalPieceItems,
} from './util';

export const buildPiecesQuery = dateFormat => makeQueryBuilder(
  'cql.allRecords=1',
  makeKeywordQueryBuilder(dateFormat),
  'sortby receiptDate',
);

const usePieceRequestsFetch = ({ tenantId }) => {
  const ky = useOkapiKy({ tenant: tenantId });

  // TODO: integrate loading of requests from several tenants after implementation MODORDERS-1138
  const fetchPieceRequests = ({ pieces, signal }) => {
    return batchRequest(
      async ({ params: searchParams }) => {
        const { requests = [] } = await ky.get(REQUESTS_API, { searchParams, signal }).json();

        return requests;
      },
      pieces,
      (piecesChunk) => {
        const itemIdsQuery = piecesChunk
          .filter(piece => piece.itemId)
          .map(piece => `itemId==${piece.itemId}`)
          .join(' or ');

        return itemIdsQuery ? `(${itemIdsQuery}) and status="Open*"` : '';
      },
    );
  };

  return { fetchPieceRequests };
};

const usePieceItemsFetch = ({ instanceId, tenantId }) => {
  const ky = useOkapiKy({ tenant: tenantId });

  const fetchPieceItems = ({ pieces, crossTenant, signal }) => {
    const kyExtended = ky.extend({ signal });

    return crossTenant
      ? fetchConsortiumPieceItems(kyExtended, { instanceId, pieces })
      : fetchLocalPieceItems(kyExtended, { pieces });
  };

  return { fetchPieceItems };
};

export const usePaginatedPieces = ({
  pagination,
  queryParams = {},
  options = {},
}) => {
  const {
    crossTenant,
    enabled = true,
    instanceId,
    tenantId,
    ...queryOptions
  } = options;

  const stripes = useStripes();
  const ky = useOkapiKy({ tenant: tenantId });

  const { fetchPieceRequests } = usePieceRequestsFetch({ tenantId });
  const { fetchPieceItems } = usePieceItemsFetch({
    instanceId,
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
      fetchPieceRequests({ pieces, crossTenant, signal }),
      fetchPieceItems({ pieces, crossTenant, signal }),
    ]);

    const itemsMap = items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
    const requestsMap = requests.reduce((acc, r) => ({ ...acc, [r.itemId]: r }), {});

    return {
      totalRecords,
      pieces: pieces.map((piece) => ({
        ...piece,
        itemId: itemsMap[piece.itemId] ? piece.itemId : undefined,
        barcode: piece?.barcode || itemsMap[piece.itemId]?.barcode,
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
    ...queryOptions,
  });

  return ({
    ...data,
    isFetching,
  });
};
