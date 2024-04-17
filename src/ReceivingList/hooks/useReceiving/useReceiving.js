import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import queryString from 'query-string';
import moment from 'moment';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import {
  getFiltersCount,
} from '@folio/stripes-acq-components';

import { buildTitlesQuery } from '../../utils';
import { TITLES_API } from '../../../common/constants';

export const useReceiving = ({
  pagination,
  fetchReferences,
  searchParams = {},
  options = {},
}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'receivings-list' });
  const { timezone } = useStripes();

  const { search } = useLocation();
  const queryParams = queryString.parse(search);
  const filtersCount = getFiltersCount(queryParams);

  moment.tz.setDefault(timezone);

  const query = buildTitlesQuery(queryParams);

  moment.tz.setDefault();

  const defaultSearchParams = {
    query,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const queryKey = [namespace, pagination.timestamp, pagination.limit, pagination.offset];
  const queryFn = async () => {
    if (!filtersCount) {
      return { titles: [], totalRecords: 0 };
    }

    const { titles, totalRecords } = await ky
      .get(TITLES_API, { searchParams: { ...defaultSearchParams, ...searchParams } })
      .json();

    const { orderLinesMap } = await fetchReferences(titles);
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
    enabled: Boolean(pagination.timestamp),
    keepPreviousData: true,
  };

  const { isFetching, data } = useQuery(
    queryKey,
    queryFn,
    {
      ...defaultOptions,
      ...options,
    },
  );

  return ({
    ...data,
    isFetching,
  });
};
