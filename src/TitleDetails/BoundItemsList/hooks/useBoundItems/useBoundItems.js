import uniqBy from 'lodash/uniqBy';
import { useQuery } from 'react-query';

import {
  LIMIT_MAX,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';
import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { TENANT_ITEMS_API } from '../../../../common/constants';
import { useReceivingSearchContext } from '../../../../contexts';

const DEFAULT_DATA = [];

export const useBoundItems = ({ titleId, poLineId, options = {} }) => {
  const { enabled = true, ...otherOptions } = options;

  const stripes = useStripes();
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'bound-items-list' });

  const {
    activeTenantId,
    isCentralOrderingEnabled,
  } = useReceivingSearchContext();

  const boundItemsQuery = `titleId==${titleId} and poLineId==${poLineId} and isBound==true`;

  const searchParams = {
    limit: LIMIT_MAX,
    query: boundItemsQuery,
  };

  const isEnabled = Boolean(
    enabled
    && titleId
    && poLineId
    && stripes.hasInterface('inventory', '13.2'),
  );

  const {
    data = DEFAULT_DATA,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [namespace, titleId, poLineId, activeTenantId, isCentralOrderingEnabled],
    queryFn: async ({ signal }) => {
      const { pieces = DEFAULT_DATA } = await ky.get(ORDER_PIECES_API, { searchParams, signal }).json();

      const dto = {
        tenantItemPairs: uniqBy(
          pieces.filter(({ isBound, bindItemId }) => Boolean(isBound && bindItemId)),
          ({ bindItemId, bindItemTenantId }) => `${isCentralOrderingEnabled ? bindItemTenantId : activeTenantId}:${bindItemId}`,
        ).map(({ bindItemId, bindItemTenantId }) => ({
          tenantId: isCentralOrderingEnabled ? bindItemTenantId : activeTenantId,
          itemId: bindItemId,
        })),
      };

      const { tenantItems, totalRecords } = await ky.post(TENANT_ITEMS_API, { json: dto, signal }).json();

      return {
        tenantItems: tenantItems.map(({ item, tenantId }) => ({ tenantId, ...item })),
        totalRecords,
      };
    },
    enabled: isEnabled,
    ...otherOptions,
  });

  return ({
    isLoading,
    isFetching,
    refetch,
    items: data?.tenantItems,
    totalRecords: data?.totalRecords,
  });
};
