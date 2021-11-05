import { ORDER_PIECES_API } from '@folio/stripes-acq-components';

import {
  getPieceById,
  getPieceIdFromCheckInResponse,
} from './utils';

const PIECE_ID = 'pieceId';

describe('getPieceById', () => {
  it('should call GET method from mutator to get piece values', () => {
    const mutator = {
      GET: jest.fn().mockReturnValue({
        catch: jest.fn(),
      }),
    };

    getPieceById(mutator)(PIECE_ID);
    expect(mutator.GET).toHaveBeenCalledWith({
      path: `${ORDER_PIECES_API}/${PIECE_ID}`,
    });
  });
});

describe('getPieceIdFromCheckInResponse', () => {
  it('should return a piece id from the response after quick receiving', () => {
    const response = [{
      receivingItemResults: [{
        pieceId: PIECE_ID,
      }],
    }];
    const id = getPieceIdFromCheckInResponse(response);

    expect(id).toBe(PIECE_ID);
  });
});
