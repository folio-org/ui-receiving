import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { TITLES_API } from '../../constants';

export const useTitle = (titleId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace('receiving-title');

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery(
    [namespace, titleId],
    ({ signal }) => ky.get(`${TITLES_API}/${titleId}`, { signal }).json(),
    {
      enabled: Boolean(titleId),
    },
  );

  return ({
    title: data,
    isFetching,
    isLoading,
  });
};
