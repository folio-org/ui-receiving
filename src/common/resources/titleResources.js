import {
  baseManifest,
} from '@folio/stripes-acq-components';

import { TITLES_API } from '../constants';

export const titlesResource = {
  ...baseManifest,
  path: TITLES_API,
  accumulate: true,
};

export const identifierTypesResource = {
  ...baseManifest,
  path: 'identifier-types',
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'identifierTypes',
};
