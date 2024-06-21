import { useQuery } from 'react-query';

import {
  batchRequest,
  ITEMS_API,
  LIMIT_MAX,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';
import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const DEFAULT_DATA = [];

export const useItemsList = ({ titleId, poLineId, options = {} }) => {
  const { enabled = true, ...otherOptions } = options;
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'bound-items-list' });
  const boundItemsQuery = `titleId==${titleId} and poLineId==${poLineId} and isBound==true`;

  const searchParams = {
    limit: LIMIT_MAX,
    query: boundItemsQuery,
  };

  const {
    data = DEFAULT_DATA,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [namespace, titleId, poLineId],
    queryFn: async () => {
      const { pieces = DEFAULT_DATA } = await ky.get(ORDER_PIECES_API, { searchParams }).json();
      const itemIds = [...new Set(pieces.filter(({ itemId }) => itemId).map(({ itemId }) => itemId))];

      const items = await batchRequest(
        ({ params }) => ky.get(ITEMS_API, { searchParams: params }).json(),
        itemIds,
      ).then(responses => responses.flatMap((response) => response.items));

      return items;
    },
    enabled: Boolean(enabled && titleId && poLineId),
    ...otherOptions,
  });

  return ({
    isLoading,
    isFetching,
    refetch,
    items: data,
    totalRecords: data.length,
  });
};
