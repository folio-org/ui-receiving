import {
  baseManifest,
} from '@folio/stripes-acq-components';

import {
  PO_LINES_API,
} from '../constants';

export const orderLinesResource = {
  ...baseManifest,
  path: PO_LINES_API,
  accumulate: true,
  records: 'poLines',
};
