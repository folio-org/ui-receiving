import {
  ITEMS_API,
  REQUESTS_API,
  SEARCH_API,
} from '@folio/stripes-acq-components';

import {
  fetchConsortiumPieceItems,
  fetchLocalPieceItems,
  fetchLocalPieceRequests,
} from './util';

const pieces = [
  {
    id: 'piece-id-1',
    itemId: 'item-id',
  },
];
const items = [{ id: 'item-id' }];
const requests = [{ id: 'request-id' }];

const buildKyMock = (res) => ({
  get: jest.fn(() => ({
    json: () => Promise.resolve(res),
  })),
})

describe('Paginated pieces utilities', () => {
  describe('fetchLocalPieceItems', () => {
    const kyMock = buildKyMock({ items });

    it('should fetch pieces items from the active tenant', async () => {
      const result = await fetchLocalPieceItems(kyMock, { pieces });

      expect(result).toEqual(items);
      expect(kyMock.get).toHaveBeenCalledWith(ITEMS_API, expect.objectContaining({}));
    });
  });

  describe('fetchConsortiumPieceItems', () => {
    const kyMock = buildKyMock({ items });
  
    it('should fetch pieces items from the all related tenants', async () => {
      const result = await fetchConsortiumPieceItems(kyMock, { pieces });

      expect(result).toEqual(items);
      expect(kyMock.get).toHaveBeenCalledWith(`${SEARCH_API}/consortium/items`, expect.objectContaining({}));
    });
  });

  describe('fetchLocalPieceRequests', () => {
    const kyMock = buildKyMock({ requests });

    it('should fetch pieces requests from the active tenant', async () => {
      const result = await fetchLocalPieceRequests(kyMock, { pieces });

      expect(result).toEqual(requests);
      expect(kyMock.get).toHaveBeenCalledWith(REQUESTS_API, expect.objectContaining({}));
    });
  });
});
