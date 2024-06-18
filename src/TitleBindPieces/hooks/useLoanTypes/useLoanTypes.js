import { useQuery } from 'react-query';

import {
  LIMIT_MAX,
  LOAN_TYPES_API,
} from '@folio/stripes-acq-components';
import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const DEFAULT_VALUE = [];

export const useLoanTypes = (options = {}) => {
  const { enabled = true, ...restOptions } = options;
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'loan-types' });

  const searchParams = {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby name',
  };

  const { isLoading, data = {} } = useQuery({
    queryKey: [namespace],
    queryFn: () => ky.get(LOAN_TYPES_API, { searchParams }).json(),
    enabled,
    ...restOptions,
  });

  return ({
    loanTypes: data.loantypes || DEFAULT_VALUE,
    isLoading,
  });
};
