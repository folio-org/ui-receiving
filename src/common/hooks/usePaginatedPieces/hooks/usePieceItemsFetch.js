import { useOkapiKy } from '@folio/stripes/core';

import {
  fetchConsortiumPieceItems,
  fetchLocalPieceItems,
} from '../util';

export const usePieceItemsFetch = ({ instanceId, tenantId }) => {
  const ky = useOkapiKy({ tenant: tenantId });

  const fetchPieceItems = ({ pieces, crossTenant, signal }) => {
    const kyExtended = ky.extend({ signal });

    return crossTenant
      ? fetchConsortiumPieceItems(kyExtended, { instanceId, pieces })
      : fetchLocalPieceItems(kyExtended, { pieces });
  };

  return { fetchPieceItems };
};
