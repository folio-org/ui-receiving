import {
  holdings,
  items,
  pieces,
} from 'fixtures';

import {
  getHoldingItems,
  getHoldingPieces,
  getHoldingsItemsAndPieces,
} from './getHoldingsItemsAndPieces';

const buildKyMock = (result) => ({
  get: () => ({
    json: () => Promise.resolve(result),
  }),
});

describe('getHoldingItems', () => {
  it('should return a list of items associated with the holding', async () => {
    const result = await getHoldingItems(buildKyMock({ items }))(holdings[0].id);

    expect(result.items).toEqual(items);
  });
});

describe('getHoldingPieces', () => {
  it('should return a list of pieces associated with the holding', async () => {
    const result = await getHoldingPieces(buildKyMock({ pieces }))(holdings[0].id);

    expect(result.pieces).toEqual(pieces);
  });
});

describe('getHoldingsItemsAndPieces', () => {
  it('should return pieces and items associated with the holding', async () => {
    const result = await getHoldingsItemsAndPieces(buildKyMock({ pieces, items }))(holdings[0].id);

    expect(result.pieces.pieces).toEqual(pieces);
    expect(result.items.items).toEqual(items);
  });
});
