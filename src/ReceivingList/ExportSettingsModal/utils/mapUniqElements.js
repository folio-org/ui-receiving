import {
  filter,
  flatten,
  flow,
  map,
  uniq,
} from 'lodash/fp';

export const mapUniqElements = (data, mapFn) => (
  flow(
    map(mapFn),
    flatten,
    filter(Boolean),
    uniq,
  )(data)
);
