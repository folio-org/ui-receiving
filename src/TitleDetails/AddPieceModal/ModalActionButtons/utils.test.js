import { PIECE_ACTIONS_BY_STATUS, PIECE_STATUS } from './constants';
import { getPieceActionMenus } from './utils';

describe('getPieceActionMenus', () => {
  it('should return empty array if status is not provided', () => {
    const result = getPieceActionMenus({});

    expect(result).toEqual([]);
  });

  it('should return empty array if status is not in PIECE_ACTIONS_BY_STATUS', () => {
    const result = getPieceActionMenus({ status: 'status' });

    expect(result).toEqual([]);
  });

  it('should return array of action menus', () => {
    const { expected } = PIECE_STATUS;
    const result = getPieceActionMenus({ status: expected, disabled: false });

    expect(result).toHaveLength(PIECE_ACTIONS_BY_STATUS[expected].length);
  });
});
