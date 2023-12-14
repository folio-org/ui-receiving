import { PIECE_ACTIONS_BY_STATUS, PIECE_STATUS } from './constants';
import { getPieceActionMenu } from './utils';

describe('getPieceActionMenus', () => {
  it('should return empty array if status is not provided', () => {
    const result = getPieceActionMenu({});

    expect(result).toEqual([]);
  });

  it('should return empty array if status is not in PIECE_ACTIONS_BY_STATUS', () => {
    const result = getPieceActionMenu({ status: 'status' });

    expect(result).toEqual([]);
  });

  it('should return array of action menus', () => {
    const { expected } = PIECE_STATUS;
    const result = getPieceActionMenu({ status: expected, disabled: false });

    expect(result).toHaveLength(PIECE_ACTIONS_BY_STATUS[expected].length);
  });
});
