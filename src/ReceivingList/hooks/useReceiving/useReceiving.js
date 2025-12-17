import queryString from 'query-string';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import { getFiltersCount } from '@folio/stripes-acq-components';

import { TITLES_API } from '../../../common/constants';
import { buildTitlesQuery } from '../../utils';

export const useReceiving = ({
  pagination,
  fetchReferences,
  searchParams = {},
  options = {},
}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'receivings-list' });
  const { timezone } = useStripes();

  const { search } = useLocation();
  const queryParams = queryString.parse(search);
  const filtersCount = getFiltersCount(queryParams);

  const query = buildTitlesQuery(queryParams, { timezone });

  const defaultSearchParams = {
    query,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const queryKey = [namespace, pagination.timestamp, pagination.limit, pagination.offset, tenantId];
  const queryFn = async ({ signal }) => {
    if (!filtersCount) {
      return { titles: [], totalRecords: 0 };
    }

    const { titles, totalRecords } = await ky
      .get(TITLES_API, {
        searchParams: { ...defaultSearchParams, ...searchParams },
        signal,
      })
      .json();

    const { orderLinesMap } = await fetchReferences(titles, ky.extend({ signal }));
    const titlesResult = titles.map(title => ({
      ...title,
      poLine: orderLinesMap[title.poLineId],
    }));

    return {
      query,
      titles: titlesResult,
      totalRecords,
    };
  };
  const defaultOptions = {
    enabled: enabled && Boolean(pagination.timestamp),
    keepPreviousData: true,
  };

  const { isFetching, data } = useQuery(
    queryKey,
    queryFn,
    {
      ...defaultOptions,
      ...queryOptions,
    },
  );

  return ({
    ...data,
    isFetching,
  });
};
