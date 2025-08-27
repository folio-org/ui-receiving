import { useOkapiKy } from '@folio/stripes/core';

import {
  fetchConsortiumPiecesItems,
  fetchLocalPiecesItems,
} from '../../../utils/api';

export const usePieceItemsFetch = ({ tenantId }) => {
  const ky = useOkapiKy({ tenant: tenantId });

  const fetchPieceItems = ({ pieces, crossTenant, signal }) => {
    const kyExtended = ky.extend({ signal });

    return crossTenant
      ? fetchConsortiumPiecesItems(kyExtended)(pieces)
      : fetchLocalPiecesItems(kyExtended)(pieces);
  };

  return { fetchPieceItems };
};
