import {
  ITEMS_API,
  LIMIT_MAX,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

export const getHoldingsItemsAndPieces = (ky) => (holdingId, params = {}) => {
  const holdingsPieces = ky.get(ORDER_PIECES_API, {
    searchParams: {
      limit: `${LIMIT_MAX}`,
      query: `holdingId==${holdingId}`,
      ...params,
    },
  })
    .json();

  const holdingsItems = ky.get(ITEMS_API, {
    searchParams: {
      limit: `${LIMIT_MAX}`,
      query: `holdingsRecordId==${holdingId}`,
      ...params,
    },
  })
    .json();

  return Promise
    .all([holdingsPieces, holdingsItems])
    .then(([piecesInHolding, itemsInHolding]) => ({
      pieces: piecesInHolding,
      items: itemsInHolding,
    }))
    .catch(() => ({}));
};
