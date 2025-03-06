import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { ORDER_PIECES_API } from '@folio/stripes-acq-components';

export const usePiece = (pieceId, options = {}) => {
  const {
    enabled = true,
    tenantId,
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'receiving-title-piece' });

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ['piece', namespace, pieceId, tenantId],
    queryFn: ({ signal }) => ky.get(`${ORDER_PIECES_API}/${pieceId}`, { signal }).json(),
    enabled: enabled && Boolean(pieceId),
  });

  return ({
    piece: data,
    isFetching,
    isLoading,
  });
};
