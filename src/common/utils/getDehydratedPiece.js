import { omit } from 'lodash';

export const getDehydratedPiece = (piece) => omit(piece, [
  'checked',
  'request',
  'itemStatus',
  'rowIndex',
  'isCreateItem',
  'holdingsRecordId',
]);
