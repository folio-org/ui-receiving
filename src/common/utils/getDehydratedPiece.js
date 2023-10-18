import { omit } from 'lodash';

export const getDehydratedPiece = (piece) => omit(piece, [
  'barcode',
  'accessionNumber',
  'callNumber',
  'checked',
  'request',
  'itemStatus',
  'rowIndex',
  'isCreateItem',
  'holdingsRecordId',
]);
