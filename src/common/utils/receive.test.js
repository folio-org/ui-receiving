import '@folio/stripes-acq-components/test/jest/__mock__';

import { checkIn, quickReceive } from './receive';

describe('test receive', () => {
  let mutatorCheckIn; let mutatorPiece; let mutatorHoldings; let mutatorItems;

  beforeEach(() => {
    mutatorCheckIn = {
      POST: jest.fn(() => Promise.resolve({ receivingResults: [{ processedWithError: 0 }] })),
    };
    mutatorPiece = {
      POST: jest.fn(() => Promise.resolve({ id: 'pieceId' })),
      PUT: jest.fn(() => Promise.resolve()),
    };
    mutatorHoldings = {
      POST: jest.fn(() => Promise.resolve({ id: 'holdingId' })),
      GET: jest.fn(() => Promise.resolve([])),
    };
    mutatorItems = {
      POST: jest.fn(() => Promise.resolve()),
    };
  });

  describe('quickReceive new piece no createItem', () => {
    it('should make appropriate requests', () => {
      const pieceValues = {};
      const instanceId = 'instanceId';

      quickReceive(mutatorCheckIn, mutatorPiece, mutatorHoldings, mutatorItems, pieceValues, instanceId)
        .then(() => {
          expect(mutatorCheckIn.POST).toHaveBeenCalled();
          expect(mutatorPiece.POST).toHaveBeenCalled();
          expect(mutatorPiece.PUT).not.toHaveBeenCalled();
          expect(mutatorItems.POST).not.toHaveBeenCalled();
          expect(mutatorHoldings.POST).not.toHaveBeenCalled();
          expect(mutatorHoldings.GET).not.toHaveBeenCalled();
        });
    });
  });

  describe('quickReceive existing piece with create item', () => {
    it('should make appropriate requests', () => {
      const pieceValues = { id: 'pieceId', isCreateItem: true, locationId: 'locationId' };
      const instanceId = 'instanceId';

      quickReceive(mutatorCheckIn, mutatorPiece, mutatorHoldings, mutatorItems, pieceValues, instanceId)
        .then(() => {
          expect(mutatorCheckIn.POST).toHaveBeenCalled();
          expect(mutatorPiece.POST).not.toHaveBeenCalled();
          expect(mutatorPiece.PUT).toHaveBeenCalled();
          expect(mutatorItems.POST).toHaveBeenCalled();
          expect(mutatorHoldings.POST).toHaveBeenCalled();
          expect(mutatorHoldings.GET).toHaveBeenCalled();
        });
    });
  });

  describe('checkIn existing piece with create item', () => {
    it('should make appropriate requests', () => {
      const pieces = [{ id: 'pieceId', isCreateItem: true, locationId: 'locationId' }];
      const instanceId = 'instanceId';

      checkIn(pieces, mutatorPiece, mutatorCheckIn, mutatorHoldings, mutatorItems, instanceId)
        .then(() => {
          expect(mutatorCheckIn.POST).toHaveBeenCalled();
          expect(mutatorPiece.POST).not.toHaveBeenCalled();
          expect(mutatorPiece.PUT).toHaveBeenCalled();
          expect(mutatorItems.POST).toHaveBeenCalled();
          expect(mutatorHoldings.POST).toHaveBeenCalled();
          expect(mutatorHoldings.GET).toHaveBeenCalled();
        });
    });
  });

  describe('checkIn existing piece without create item', () => {
    it('should make appropriate requests', () => {
      const pieces = [{ id: 'pieceId', locationId: 'locationId' }];
      const instanceId = 'instanceId';

      checkIn(pieces, mutatorPiece, mutatorCheckIn, mutatorHoldings, mutatorItems, instanceId)
        .then(() => {
          expect(mutatorCheckIn.POST).toHaveBeenCalled();
          expect(mutatorPiece.POST).not.toHaveBeenCalled();
          expect(mutatorPiece.PUT).toHaveBeenCalled();
          expect(mutatorItems.POST).not.toHaveBeenCalled();
          expect(mutatorHoldings.POST).not.toHaveBeenCalled();
          expect(mutatorHoldings.GET).not.toHaveBeenCalled();
        });
    });
  });
});
