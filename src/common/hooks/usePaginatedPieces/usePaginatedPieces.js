import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  batchRequest,
  makeQueryBuilder,
  ITEMS_API,
  ORDER_PIECES_API,
  REQUESTS_API,
} from '@folio/stripes-acq-components';

import { getPieceStatusFromItem } from '../../utils';

export const buildPiecesQuery = makeQueryBuilder(
  'cql.allRecords=1',
  (query, qindex) => {
    if (qindex) {
      return `(${qindex}="${query}*")`;
    }

    return '';
  },
  'sortby receiptDate',
);

const usePieceRequestsFetch = () => {
  const ky = useOkapiKy();

  const fetchPieceRequests = pieces => {
    return batchRequest(
      async ({ params: searchParams }) => {
        const { requests = [] } = await ky.get(REQUESTS_API, { searchParams }).json();

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

const usePieceItemsFetch = () => {
  const ky = useOkapiKy();

  const fetchPieceItems = pieces => {
    return batchRequest(
      async ({ params: searchParams }) => {
        const { items = [] } = await ky.get(ITEMS_API, { searchParams }).json();

        return items;
      },
      pieces.filter(({ itemId }) => itemId).map(({ itemId }) => itemId),
    );
  };

  return { fetchPieceItems };
};

export const usePaginatedPieces = ({
  pagination,
  queryParams = {},
  options = {},
}) => {
  const ky = useOkapiKy();
  const { fetchPieceRequests } = usePieceRequestsFetch();
  const { fetchPieceItems } = usePieceItemsFetch();
  const [namespace] = useNamespace({ key: `${queryParams.receivingStatus}-pieces-list` });

  const query = buildPiecesQuery(queryParams);

  const searchParams = {
    query,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const queryKey = [namespace, pagination.timestamp, pagination.limit, pagination.offset];
  const queryFn = async () => {
    const { pieces, totalRecords } = await ky
      .get(ORDER_PIECES_API, { searchParams })
      .json();

    const [requests, items] = await Promise.all([
      fetchPieceRequests(pieces),
      fetchPieceItems(pieces),
    ]);

    const itemsMap = items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
    const requestsMap = requests.reduce((acc, r) => ({ ...acc, [r.itemId]: r }), {});

    return {
      totalRecords,
      pieces: pieces.map((piece) => ({
        ...piece,
        itemId: itemsMap[piece.itemId] ? piece.itemId : undefined,
        barcode: itemsMap[piece.itemId]?.barcode,
        callNumber: itemsMap[piece.itemId]?.itemLevelCallNumber,
        itemStatus: getPieceStatusFromItem(itemsMap[piece.itemId]),
        request: requestsMap[piece.itemId],
        holdingsRecordId: itemsMap[piece.itemId]?.holdingsRecordId,
      })),
    };
  };
  const defaultOptions = {
    enabled: Boolean(pagination.timestamp),
    keepPreviousData: true,
  };

  const { isFetching, data } = useQuery(
    queryKey,
    queryFn,
    {
      ...defaultOptions,
      ...options,
    },
  );

  return ({
    ...data,
    isFetching,
  });
};
