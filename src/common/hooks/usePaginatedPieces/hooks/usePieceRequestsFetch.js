import { useOkapiKy } from '@folio/stripes/core';

import {
  fetchConsortiumPieceRequests,
  fetchLocalPieceRequests,
} from '../util';

export const usePieceRequestsFetch = ({ tenantId } = {}) => {
  const ky = useOkapiKy({ tenant: tenantId });

  const fetchPieceRequests = ({ pieces, signal, crossTenant }) => {
    const kyExtended = ky.extend({ signal });

    return crossTenant
      ? fetchConsortiumPieceRequests(ky, { pieces, signal })
      : fetchLocalPieceRequests(kyExtended, { pieces });
  };

  return { fetchPieceRequests };
};
