import { useQuery } from 'react-query';

import {
  LIMIT_MAX,
  MATERIAL_TYPE_API,
} from '@folio/stripes-acq-components';
import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

export const DEFAULT_VALUE = [];

export const useMaterialTypes = (options = {}) => {
  const { enabled = true, ...restOptions } = options;
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'material-types' });

  const searchParams = {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby name',
  };

  const { isLoading, data = {} } = useQuery(
    [namespace],
    () => ky.get(MATERIAL_TYPE_API, { searchParams }).json(),
    {
      enabled,
      ...restOptions,
    },
  );

  return ({
    materialTypes: data.mtypes || DEFAULT_VALUE,
    isLoading,
  });
};
