import { PIECE_STATUS } from '@folio/stripes-acq-components';

import { PIECE_ACTIONS_BY_STATUS } from './constants';
import { getPieceActionMenu } from './utils';

const { expected, unReceivable, received } = PIECE_STATUS;

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
    const result = getPieceActionMenu({ status: expected, disabled: false });

    expect(result).toHaveLength(PIECE_ACTIONS_BY_STATUS[expected].length);
  });

  describe('delete action', () => {
    it('should not return `delete` action menu if `isEditMode` is false', () => {
      const result = getPieceActionMenu({ status: expected, disabled: false, isEditMode: false });

      expect(result).toContain(null);
    });

    it('should `delete` button be disabled if `canDeletePiece` is false', () => {
      const result = getPieceActionMenu({ status: expected, disabled: false, isEditMode: true, canDeletePiece: false });
      const deleteButton = result.find(i => i.props['data-testid'] === 'delete-piece-button');

      expect(deleteButton.props).toEqual(expect.objectContaining({ disabled: true }));
    });
  });

  describe('expect action', () => {
    it('should `onStatusChange` be called with `Expected` status value', () => {
      const onStatusChange = jest.fn();
      const result = getPieceActionMenu({ status: unReceivable, disabled: true, onStatusChange });
      const expectButton = result.find(i => i.props['data-testid'] === 'expect-piece-button');

      expectButton.props.onClick();

      expect(onStatusChange).toHaveBeenCalledWith(PIECE_STATUS.expected);
    });
  });

  describe('unReceive action', () => {
    it('should `onStatusChange` be called with `Expected` status value', () => {
      const onStatusChange = jest.fn();
      const result = getPieceActionMenu({ status: received, disabled: false, onStatusChange });
      const receiveButton = result.find(i => i.props['data-testid'] === 'unReceive-piece-button');

      receiveButton.props.onClick();

      expect(onStatusChange).toHaveBeenCalledWith(PIECE_STATUS.expected);
    });
  });

  describe('unReceivable action', () => {
    it('should `onStatusChange` be called with `Unreceivable` status value', () => {
      const onStatusChange = jest.fn();
      const result = getPieceActionMenu({ status: expected, disabled: false, onStatusChange });
      const receiveButton = result.find(i => i.props['data-testid'] === 'unReceivable-piece-button');

      receiveButton.props.onClick();

      expect(onStatusChange).toHaveBeenCalledWith(PIECE_STATUS.unReceivable);
    });
  });
});
