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
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'receiving-title' });

  const { data, ...rest } = useQuery({
    queryKey: [namespace, titleId, tenantId],
    queryFn: ({ signal }) => ky.get(`${TITLES_API}/${titleId}`, { signal }).json(),
    enabled: enabled && Boolean(titleId),
    ...queryOptions,
  });

  return ({
    title: data,
    ...rest,
  });
};
