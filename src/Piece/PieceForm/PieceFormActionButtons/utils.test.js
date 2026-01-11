import { PIECE_STATUS } from '@folio/stripes-acq-components';

import { PIECE_ACTION_NAMES } from '../../constants';
import { PIECE_ACTIONS_BY_STATUS } from './constants';
import {
  getPieceActionsByStatus,
  getPieceActionsMenu,
} from './utils';

const {
  expected,
  received,
  unreceivable,
} = PIECE_STATUS;

describe('getPieceActionMenus', () => {
  const onToggle = jest.fn();

  it('should return empty array if status is not provided', () => {
    const result = getPieceActionsMenu({ onToggle });

    expect(result).toEqual([]);
  });

  it('should return empty array if status is not in PIECE_ACTIONS_BY_STATUS', () => {
    const actions = getPieceActionsByStatus('status');
    const result = getPieceActionsMenu({
      actions,
      onToggle,
    });

    expect(result).toEqual([]);
  });

  it('should return array of action menus for an existing piece in "Expected" status', () => {
    const actions = getPieceActionsByStatus(expected);
    const result = getPieceActionsMenu({
      actions,
      isEditMode: true,
      onToggle,
    });

    expect(result).toHaveLength(PIECE_ACTIONS_BY_STATUS[expected].length);
  });

  it('should return array of action menus for an new piece', () => {
    const actions = getPieceActionsByStatus(expected);
    const result = getPieceActionsMenu({
      actions,
      onToggle,
      isEditMode: false,
    });

    expect(result).toHaveLength(PIECE_ACTIONS_BY_STATUS[expected].length - 2); // excluding 'delete' and 'send claim' actions
  });

  describe('delete action', () => {
    it('should `delete` button be disabled', () => {
      const actions = getPieceActionsByStatus(expected);
      const result = getPieceActionsMenu({
        actions,
        actionsDisabled: { [PIECE_ACTION_NAMES.delete]: true },
        isEditMode: true,
        onToggle,
      });
      const deleteButton = result.find(i => i.props['data-testid'] === 'delete-piece-button');

      expect(deleteButton.props).toEqual(expect.objectContaining({ disabled: true }));
    });
  });

  describe('expect action', () => {
    it('should `onStatusChange` be called with `Expected` status value', () => {
      const onStatusChange = jest.fn();
      const actions = getPieceActionsByStatus(unreceivable);
      const result = getPieceActionsMenu({
        actions,
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
      const actions = getPieceActionsByStatus(received);
      const result = getPieceActionsMenu({
        actions,
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
      const actions = getPieceActionsByStatus(expected);
      const result = getPieceActionsMenu({
        actions,
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

      const actions = getPieceActionsByStatus(expected);
      const result = getPieceActionsMenu({
        actions,
        onStatusChange,
        onToggle,
      });
      const markLateButton = result.find(i => i.props['data-testid'] === 'mark-late-piece-button');

      markLateButton.props.onClick();

      expect(onStatusChange).toHaveBeenCalledWith(PIECE_STATUS.late);
    });
  });
});
