import { omit } from 'lodash';

export const getDehydratedPiece = (piece) => omit(
  piece,
  ['barcode', 'callNumber', 'checked', 'request', 'itemStatus', 'rowIndex', 'isCreateItem'],
);
