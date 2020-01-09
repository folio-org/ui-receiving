import {
  baseManifest,
} from '@folio/stripes-acq-components';

import {
  TITLE_API,
  TITLES_API,
} from '../constants';

export const titlesResource = {
  ...baseManifest,
  path: TITLES_API,
  accumulate: true,
};

export const titleResource = {
  ...baseManifest,
  path: TITLE_API,
};
