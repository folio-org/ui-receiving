import { ORDER_PIECES_API } from '@folio/stripes-acq-components';

export const getPieceIdFromCheckInResponse = (response) => response?.[0]?.receivingItemResults?.[0]?.pieceId;

export const getPieceById = (pieceMutator) => (id) => (
  pieceMutator.GET({
    path: `${ORDER_PIECES_API}/${id}`,
  })
    .catch(() => ({}))
);
