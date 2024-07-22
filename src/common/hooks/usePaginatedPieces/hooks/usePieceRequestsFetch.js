import { useOkapiKy } from '@folio/stripes/core';

import { fetchLocalPieceRequests } from '../util';

export const usePieceRequestsFetch = ({ tenantId } = {}) => {
  const ky = useOkapiKy({ tenant: tenantId });

  const fetchPieceRequests = ({ pieces, signal }) => {
    const kyExtended = ky.extend({ signal });

    return fetchLocalPieceRequests(kyExtended, { pieces });
  };

  return { fetchPieceRequests };
};
