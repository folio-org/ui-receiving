import {
  LIMIT_MAX,
  LIMIT_PARAMETER,
} from '@folio/stripes-acq-components';

export const buildPieceRequestsSearchParams = (pieces = []) => {
  const searchParams = new URLSearchParams({
    [LIMIT_PARAMETER]: LIMIT_MAX,
    status: 'Open*',
  });

  pieces.filter(i => i?.itemId).forEach(({ id }) => {
    searchParams.append('pieceIds', id);
  });

  return searchParams;
};
