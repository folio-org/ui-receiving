import { useOkapiKy } from '@folio/stripes/core';
import {
  batchRequest,
  REQUESTS_API,
} from '@folio/stripes-acq-components';

export const usePieceRequestsFetch = ({ tenantId }) => {
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
