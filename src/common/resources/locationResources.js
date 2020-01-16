import {
  baseManifest,
} from '@folio/stripes-acq-components';

import {
  LOCATIONS_API,
} from '../constants';

export const locationsResource = {
  ...baseManifest,
  path: LOCATIONS_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  accumulate: true,
  records: 'locations',
};
