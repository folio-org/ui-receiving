import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import {
  DelayClaimActionMenuItem,
  MarkUnreceivableActionMenuItem,
  PIECE_STATUS,
  SendClaimActionMenuItem,
} from '@folio/stripes-acq-components';

import { PIECE_ACTION_NAMES } from '../../constants';
import { PIECE_ACTIONS_BY_STATUS } from './constants';

// Returns array of action names available for the given piece status
export const getPieceActionsByStatus = (status) => {
  return PIECE_ACTIONS_BY_STATUS[status] || [];
};

// Returns dictionary of action name to action component mappings
export const getPieceActionsMenuDict = ({
  actionsDisabled = {},
  isEditMode,
  onClaimDelay,
  onClaimSend,
  onCreateAnotherPiece,
  onDelete,
  onReceive,
  onStatusChange,
  onToggle,
  onUnreceivePiece,
}) => ({
  [PIECE_ACTION_NAMES.delayClaim]: (
    <DelayClaimActionMenuItem
      disabled={actionsDisabled[PIECE_ACTION_NAMES.delayClaim]}
      onClick={(e) => {
        onToggle(e);
        onClaimDelay();
      }}
    />
  ),
  [PIECE_ACTION_NAMES.delete]: (
    isEditMode
      ? (
        <Button
          buttonStyle="dropdownItem"
          data-testid="delete-piece-button"
          disabled={actionsDisabled[PIECE_ACTION_NAMES.delete]}
          onClick={() => {
            onToggle();
            onDelete();
          }}
        >
          <Icon icon="trash">
            <FormattedMessage id="ui-receiving.piece.action.button.delete" />
          </Icon>
        </Button>
      )
      : null
  ),
  [PIECE_ACTION_NAMES.expect]: (
    <Button
      disabled={actionsDisabled[PIECE_ACTION_NAMES.expect]}
      buttonStyle="dropdownItem"
      data-testid="expect-piece-button"
      onClick={() => {
        onToggle();
        onStatusChange(PIECE_STATUS.expected);
      }}
    >
      <Icon icon="calendar">
        <FormattedMessage id="ui-receiving.piece.action.button.expect" />
      </Icon>
    </Button>
  ),
  [PIECE_ACTION_NAMES.quickReceive]: (
    <Button
      disabled={actionsDisabled[PIECE_ACTION_NAMES.quickReceive]}
      data-testid="quickReceive"
      buttonStyle="dropdownItem"
      onClick={() => {
        onToggle();
        onReceive();
      }}
    >
      <Icon icon="receive">
        <FormattedMessage id="ui-receiving.piece.action.button.quickReceive" />
      </Icon>
    </Button>
  ),
  [PIECE_ACTION_NAMES.saveAndCreate]: (
    <Button
      disabled={actionsDisabled[PIECE_ACTION_NAMES.saveAndCreate]}
      buttonStyle="dropdownItem"
      data-testid="create-another-piece-button"
      onClick={() => {
        onToggle();
        onCreateAnotherPiece();
      }}
    >
      <Icon icon="save">
        <FormattedMessage id="ui-receiving.piece.action.button.saveAndCreateAnother" />
      </Icon>
    </Button>
  ),
  [PIECE_ACTION_NAMES.sendClaim]: (
    isEditMode
      ? (
        <SendClaimActionMenuItem
          disabled={actionsDisabled[PIECE_ACTION_NAMES.sendClaim]}
          onClick={(e) => {
            onToggle(e);
            onClaimSend();
          }}
        />
      )
      : null
  ),
  [PIECE_ACTION_NAMES.unReceive]: (
    <Button
      disabled={actionsDisabled[PIECE_ACTION_NAMES.unReceive]}
      buttonStyle="dropdownItem"
      data-testid="unReceive-piece-button"
      onClick={() => {
        onToggle();
        onUnreceivePiece();
      }}
    >
      <Icon icon="cancel">
        <FormattedMessage id="ui-receiving.piece.action.button.unReceive" />
      </Icon>
    </Button>
  ),
  [PIECE_ACTION_NAMES.unReceivable]: (
    <MarkUnreceivableActionMenuItem
      data-testid="unreceivable-button"
      disabled={actionsDisabled[PIECE_ACTION_NAMES.unReceivable]}
      onClick={(e) => {
        onToggle(e);
        onStatusChange(PIECE_STATUS.unreceivable);
      }}
    />
  ),
  [PIECE_ACTION_NAMES.markLate]: (
    <Button
      disabled={actionsDisabled[PIECE_ACTION_NAMES.markLate]}
      buttonStyle="dropdownItem"
      data-testid="mark-late-piece-button"
      onClick={() => {
        onToggle();
        onStatusChange(PIECE_STATUS.late);
      }}
    >
      <Icon icon="clock">
        <FormattedMessage id="ui-receiving.piece.action.button.markLate" />
      </Icon>
    </Button>
  ),
});

// Returns array of action components for the given action names
export const getPieceActionsMenu = ({ actions = [], ...rest }) => {
  const actionsMenuDict = getPieceActionsMenuDict(rest);

  return actions
    .map((action) => actionsMenuDict[action])
    .filter(Boolean);
};
