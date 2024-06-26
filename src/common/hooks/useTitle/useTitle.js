import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { TITLES_API } from '../../constants';

export const useTitle = (titleId, options = {}) => {
  const {
    enabled = true,
    tenantId,
  } = options;

  const ky = useOkapiKy({ tenantId });
  const [namespace] = useNamespace('receiving-title');

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, titleId, tenantId],
    queryFn: ({ signal }) => ky.get(`${TITLES_API}/${titleId}`, { signal }).json(),
    enabled: enabled && Boolean(titleId),
  });

  return ({
    title: data,
    isFetching,
    isLoading,
  });
};
