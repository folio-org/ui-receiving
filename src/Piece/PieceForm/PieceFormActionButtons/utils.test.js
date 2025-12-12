import { PIECE_STATUS } from '@folio/stripes-acq-components';

import { PIECE_ACTION_NAMES } from '../../constants';
import { PIECE_ACTIONS_BY_STATUS } from './constants';
import { getPieceActionMenu } from './utils';

const { expected, unreceivable, received } = PIECE_STATUS;

describe('getPieceActionMenus', () => {
  const onToggle = jest.fn();

  it('should return empty array if status is not provided', () => {
    const result = getPieceActionMenu({ onToggle });

    expect(result).toEqual([]);
  });

  it('should return empty array if status is not in PIECE_ACTIONS_BY_STATUS', () => {
    const result = getPieceActionMenu({
      onToggle,
      status: 'status',
    });

    expect(result).toEqual([]);
  });

  it('should return array of action menus for an existing piece in "Expected" status', () => {
    const result = getPieceActionMenu({
      onToggle,
      status: expected,
      isEditMode: true,
    });

    expect(result).toHaveLength(PIECE_ACTIONS_BY_STATUS[expected].length);
  });

  it('should return array of action menus for an new piece', () => {
    const result = getPieceActionMenu({
      onToggle,
      status: expected,
      isEditMode: false,
    });

    expect(result).toHaveLength(PIECE_ACTIONS_BY_STATUS[expected].length - 2); // excluding 'delete' and 'send claim' actions
  });

  describe('delete action', () => {
    it('should `delete` button be disabled', () => {
      const result = getPieceActionMenu({
        actionsDisabled: { [PIECE_ACTION_NAMES.delete]: true },
        isEditMode: true,
        onToggle,
        status: expected,
      });
      const deleteButton = result.find(i => i.props['data-testid'] === 'delete-piece-button');

      expect(deleteButton.props).toEqual(expect.objectContaining({ disabled: true }));
    });
  });

  describe('expect action', () => {
    it('should `onStatusChange` be called with `Expected` status value', () => {
      const onStatusChange = jest.fn();
      const result = getPieceActionMenu({
        status: unreceivable,
        onStatusChange,
        onToggle,
      });
      const expectButton = result.find(i => i.props['data-testid'] === 'expect-piece-button');

      expectButton.props.onClick();

      expect(onStatusChange).toHaveBeenCalledWith(PIECE_STATUS.expected);
    });
  });

  describe('unReceive action', () => {
    it('should `onUnreceivePiece` be called with `Expected` status value', () => {
      const onUnreceivePiece = jest.fn();
      const result = getPieceActionMenu({
        status: received,
        onToggle,
        onUnreceivePiece,
      });
      const unreceiveButton = result.find(i => i.props['data-testid'] === 'unReceive-piece-button');

      unreceiveButton.props.onClick();

      expect(onUnreceivePiece).toHaveBeenCalledWith();
    });
  });

  describe('unReceivable action', () => {
    it('should `onStatusChange` be called with `Unreceivable` status value', () => {
      const onStatusChange = jest.fn();
      const result = getPieceActionMenu({
        status: expected,
        onStatusChange,
        onToggle,
      });
      const unreceivableButton = result.find(i => i.props['data-testid'] === 'unreceivable-button');

      unreceivableButton.props.onClick();

      expect(onStatusChange).toHaveBeenCalledWith(PIECE_STATUS.unreceivable);
    });
  });

  describe('"Mark late" action', () => {
    it('should call `onStatusChange` with `Late` status value', () => {
      const onStatusChange = jest.fn();

      const result = getPieceActionMenu({
        status: expected,
        onStatusChange,
        onToggle,
      });
      const markLateButton = result.find(i => i.props['data-testid'] === 'mark-late-piece-button');

      markLateButton.props.onClick();

      expect(onStatusChange).toHaveBeenCalledWith(PIECE_STATUS.late);
    });
  });
});
