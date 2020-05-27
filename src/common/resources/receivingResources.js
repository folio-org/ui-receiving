import {
  baseManifest,
} from '@folio/stripes-acq-components';

import {
  CHECKIN_API,
  HOLDINGS_API,
  RECEIVE_API,
} from '../constants';

export const checkInResource = {
  ...baseManifest,
  clientGeneratePk: false,
  fetch: false,
  path: CHECKIN_API,
};

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
