import { useOkapiKy } from '@folio/stripes/core';

import { fetchLocalPiecesRequests } from '../../../utils';

export const usePieceRequestsFetch = ({ tenantId } = {}) => {
  const ky = useOkapiKy({ tenant: tenantId });

  const fetchPieceRequests = ({ pieces, signal }) => {
    const kyExtended = ky.extend({ signal });

    return fetchLocalPiecesRequests(kyExtended)(pieces);
  };

  return { fetchPieceRequests };
};
