import {
  baseManifest,
} from '@folio/stripes-acq-components';

import {
  LOCATIONS_API,
} from '../constants';

export const locationsResource = {
  ...baseManifest,
  path: LOCATIONS_API,
  accumulate: true,
  records: 'locations',
};
