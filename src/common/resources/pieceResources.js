import {
  baseManifest,
} from '@folio/stripes-acq-components';

import {
  CHECKIN_API,
  ORDER_PIECES_API,
  PIECES_API,
  RECEIVE_API,
} from '../constants';

export const pieceResource = {
  ...baseManifest,
  accumulate: true,
  clientGeneratePk: false,
  fetch: false,
  path: PIECES_API,
  records: 'pieces',
};

export const orderPiecesResource = {
  ...baseManifest,
  accumulate: true,
  clientGeneratePk: false,
  path: ORDER_PIECES_API,
  records: 'checkInItems',
};

export const checkInResource = {
  ...baseManifest,
  clientGeneratePk: false,
  fetch: false,
  path: CHECKIN_API,
  records: 'toBeReceived',
};

export const receivingResource = {
  ...baseManifest,
  accumulate: true,
  clientGeneratePk: false,
  path: RECEIVE_API,
  records: 'toBeReceived',
};
