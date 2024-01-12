import { omit } from 'lodash';

export const getDehydratedPiece = (piece) => omit(piece, [
  'callNumber',
  'checked',
  'request',
  'itemStatus',
  'rowIndex',
  'isCreateItem',
  'holdingsRecordId',
]);
