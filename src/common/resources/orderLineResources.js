import {
  baseManifest,
  LINES_API,
  ORDERS_API,
} from '@folio/stripes-acq-components';

export const orderLinesResource = {
  ...baseManifest,
  path: LINES_API,
  accumulate: true,
  records: 'poLines',
};

export const ordersResource = {
  ...baseManifest,
  accumulate: true,
  fetch: false,
  path: ORDERS_API,
  records: 'purchaseOrders',
};
