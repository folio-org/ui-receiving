import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { LINES_API } from '@folio/stripes-acq-components';

export const usePOLine = (poLineId, options = {}) => {
  const { enabled = true, ...otherOptions } = options;
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'fetch-poLine' });

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery(
    [namespace, poLineId],
    ({ signal }) => ky.get(`${LINES_API}/${poLineId}`, { signal }).json(),
    {
      enabled: Boolean(enabled && poLineId),
      ...otherOptions,
    },
  );

  return ({
    poLine: data,
    isFetching,
    isLoading,
  });
};
