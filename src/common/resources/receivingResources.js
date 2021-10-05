import {
  baseManifest,
} from '@folio/stripes-acq-components';

import {
  RECEIVE_API,
  HOLDINGS_API,
} from '../constants';

export const receivingResource = {
  ...baseManifest,
  accumulate: true,
  clientGeneratePk: false,
  fetch: false,
  path: RECEIVE_API,
};

export const holdingsResource = {
  ...baseManifest,
  accumulate: true,
  clientGeneratePk: false,
  path: HOLDINGS_API,
  records: 'holdingsRecords',
};
