import without from 'lodash/without';
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

export const EXPECTED_PIECES_ACTIONS = [
  PIECE_ACTION_NAMES.saveAndCreate,
  PIECE_ACTION_NAMES.quickReceive,
  PIECE_ACTION_NAMES.markLate,
  PIECE_ACTION_NAMES.sendClaim,
  PIECE_ACTION_NAMES.delayClaim,
  PIECE_ACTION_NAMES.unReceivable,
  PIECE_ACTION_NAMES.delete,
];

export const PIECE_ACTIONS_BY_STATUS = {
  [PIECE_STATUS.expected]: EXPECTED_PIECES_ACTIONS,
  [PIECE_STATUS.claimDelayed]: EXPECTED_PIECES_ACTIONS,
  [PIECE_STATUS.claimSent]: EXPECTED_PIECES_ACTIONS,
  [PIECE_STATUS.late]: without(EXPECTED_PIECES_ACTIONS, PIECE_ACTION_NAMES.markLate),
  [PIECE_STATUS.received]: [
    PIECE_ACTION_NAMES.saveAndCreate,
    PIECE_ACTION_NAMES.unReceive,
    PIECE_ACTION_NAMES.delete,
  ],
  [PIECE_STATUS.unreceivable]: [
    PIECE_ACTION_NAMES.saveAndCreate,
    PIECE_ACTION_NAMES.expect,
    PIECE_ACTION_NAMES.delete,
  ],
};

export const PIECE_ACTIONS = ({
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
