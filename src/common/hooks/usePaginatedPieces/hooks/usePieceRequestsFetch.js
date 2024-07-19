import { useOkapiKy } from '@folio/stripes/core';

import { fetchLocalPieceRequests } from '../util';

export const usePieceRequestsFetch = ({ tenantId } = {}) => {
  const ky = useOkapiKy({ tenant: tenantId });

  const fetchPieceRequests = ({ pieces, signal }) => {
    const kyExtended = ky.extend({ signal });

    // TODO: integrate loading of requests from several tenants after implementation MODORDERS-1138
    return fetchLocalPieceRequests(kyExtended, { pieces });
  };

  return { fetchPieceRequests };
};
