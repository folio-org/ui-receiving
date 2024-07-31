import {
  ITEMS_API,
  LIMIT_MAX,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

export const getHoldingPieces = (ky) => (holdingId, params = {}) => {
  return ky.get(ORDER_PIECES_API, {
    searchParams: {
      limit: `${LIMIT_MAX}`,
      query: `holdingId==${holdingId}`,
      ...params,
    },
  }).json();
};

export const getHoldingItems = (ky) => (holdingId, params = {}) => {
  return ky.get(ITEMS_API, {
    searchParams: {
      limit: `${LIMIT_MAX}`,
      query: `holdingsRecordId==${holdingId}`,
      ...params,
    },
  }).json();
};

export const getHoldingsItemsAndPieces = (ky) => (holdingId, params = {}) => {
  return Promise
    .all([
      getHoldingPieces(ky)(holdingId, params),
      getHoldingItems(ky)(holdingId, params),
    ])
    .then(([piecesInHolding, itemsInHolding]) => ({
      pieces: piecesInHolding,
      items: itemsInHolding,
    }))
    .catch(() => ({}));
};
