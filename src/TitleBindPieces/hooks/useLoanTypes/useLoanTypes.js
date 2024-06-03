import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  LIMIT_MAX,
  LOAN_TYPES_API,
} from '@folio/stripes-acq-components';

const DEFAULT_VALUE = [];

export const useLoanTypes = (options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'loan-types' });

  const searchParams = {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby name',
  };

  const { isLoading, data = {} } = useQuery(
    [namespace],
    () => ky.get(LOAN_TYPES_API, { searchParams }).json(),
    {
      enabled: true,
      ...options,
    },
  );

  return ({
    loanTypes: data.loantypes || DEFAULT_VALUE,
    isLoading,
  });
};
