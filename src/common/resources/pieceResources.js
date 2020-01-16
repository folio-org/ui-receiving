import {
  baseManifest,
} from '@folio/stripes-acq-components';

import {
  ORDER_PIECES_API,
  PIECES_API,
  CHECKIN_API,
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
