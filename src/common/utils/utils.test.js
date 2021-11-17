import {
  getPieceById,
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
