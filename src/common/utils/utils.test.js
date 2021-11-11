import {
  getPieceById,
  getPieceIdFromCheckInResponse,
} from './utils';

const PIECE_ID = 'pieceId';

describe('getPieceById', () => {
  const mutator = {
    GET: (params) => new Promise((res, rej) => {
      const includesId = params.path.includes(PIECE_ID);

      // eslint-disable-next-line prefer-promise-reject-errors
      return includesId ? res({ id: PIECE_ID }) : rej({});
    }),
  };

  it('should return a piece fetched by id if it was resolved', async () => {
    const res = await getPieceById(mutator)(PIECE_ID);

    expect(res).toEqual({ id: PIECE_ID });
  });

  it('should return an empty object if it was rejected', async () => {
    const res = await getPieceById(mutator)();

    expect(res).toEqual({});
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
