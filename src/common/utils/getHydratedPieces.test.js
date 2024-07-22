import { getHydratedPieces } from './getHydratedPieces';

const fetchPieceItems = jest.fn();
const fetchPieceRequests = jest.fn();
const pieces = [{ itemId: 'itemId' }];
const crossTenant = 'crossTenant';

describe('getHydratedPieces', () => {
  beforeEach(() => {
    fetchPieceItems.mockClear();
    fetchPieceRequests.mockClear();
  });

  it('should return pieces with item data', async () => {
    fetchPieceItems.mockReturnValue(Promise.resolve([
      {
        id: 'itemId',
        barcode: 'barcode',
        accessionNumber: 'accessionNumber',
        itemLevelCallNumber: 'callNumber',
        status: { name: 'status' },
        holdingsRecordId: 'holdingsRecordId',
      },
    ]));
    fetchPieceRequests.mockReturnValue(Promise.resolve([
      {
        itemId: 'itemId',
        id: 'request',
      },
    ]));

    const result = await getHydratedPieces({
      crossTenant,
      fetchPieceItems,
      fetchPieceRequests,
      pieces,
    });

    expect(result).toEqual([
      {
        itemId: 'itemId',
        barcode: 'barcode',
        accessionNumber: 'accessionNumber',
        callNumber: 'callNumber',
        itemStatus: 'status',
        request: { itemId: 'itemId', id: 'request' },
        holdingsRecordId: 'holdingsRecordId',
      },
    ]);
  });

  it('should return pieces without item data', async () => {
    fetchPieceItems.mockReturnValue(Promise.resolve([]));
    fetchPieceRequests.mockReturnValue(Promise.resolve([]));

    const result = await getHydratedPieces({
      crossTenant,
      fetchPieceItems,
      fetchPieceRequests,
      pieces,
    });

    expect(result).toEqual([
      {
        itemId: undefined,
        barcode: undefined,
        accessionNumber: undefined,
        callNumber: undefined,
        itemStatus: 'Undefined',
        request: undefined,
        holdingsRecordId: undefined,
      },
    ]);
  });
});
