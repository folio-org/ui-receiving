import {
  baseManifest,
} from '@folio/stripes-acq-components';

import {
  RECEIVE_API,
} from '../constants';

export const receivingResource = {
  ...baseManifest,
  accumulate: true,
  clientGeneratePk: false,
  fetch: false,
  path: RECEIVE_API,
};
