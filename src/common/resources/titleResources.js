import {
  baseManifest,
} from '@folio/stripes-acq-components';

import { TITLES_API } from '../constants';

export const titlesResource = {
  ...baseManifest,
  path: TITLES_API,
  accumulate: true,
};
