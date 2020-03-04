import { omit } from 'lodash';

export const getDehydratedPiece = (piece) => omit(
  piece,
  ['barcode', 'callNumber', 'request', 'itemStatus', 'rowIndex'],
);
