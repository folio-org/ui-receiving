import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import { PIECE_STATUS } from '@folio/stripes-acq-components';

export const PIECE_ACTION_NAMES = {
  saveAndClose: 'saveAndClose',
  saveAndCreate: 'saveAndCreate',
  quickReceive: 'quickReceive',
  sendClaim: 'sendClaim',
  delayClaim: 'delayClaim',
  unReceivable: 'unReceivable',
  unReceive: 'unReceive',
  expect: 'expect',
  delete: 'delete',
};

export const EXPECTED_PIECES_ACTIONS = [
  PIECE_ACTION_NAMES.saveAndCreate,
  PIECE_ACTION_NAMES.quickReceive,
  PIECE_ACTION_NAMES.sendClaim,
  PIECE_ACTION_NAMES.delayClaim,
  PIECE_ACTION_NAMES.unReceivable,
  PIECE_ACTION_NAMES.delete,
];

export const PIECE_ACTIONS_BY_STATUS = {
  [PIECE_STATUS.expected]: EXPECTED_PIECES_ACTIONS,
  [PIECE_STATUS.claimDelayed]: EXPECTED_PIECES_ACTIONS,
  [PIECE_STATUS.claimSent]: EXPECTED_PIECES_ACTIONS,
  [PIECE_STATUS.late]: EXPECTED_PIECES_ACTIONS,
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
  onStatusChange,
  onDelete,
  onReceive,
  onUnreceivePiece,
}) => ({
  [PIECE_ACTION_NAMES.delayClaim]: (
    <Button
      disabled={actionsDisabled[PIECE_ACTION_NAMES.delayClaim]}
      buttonStyle="dropdownItem"
      data-testid="delay-claim-button"
      onClick={onClaimDelay}
    >
      <Icon icon="calendar">
        <FormattedMessage id="ui-receiving.piece.action.button.delayClaim" />
      </Icon>
    </Button>
  ),
  [PIECE_ACTION_NAMES.delete]: isEditMode ? (
    <Button
      onClick={onDelete}
      buttonStyle="dropdownItem"
      data-testid="delete-piece-button"
      disabled={actionsDisabled[PIECE_ACTION_NAMES.delete]}
    >
      <Icon icon="trash">
        <FormattedMessage id="ui-receiving.piece.action.button.delete" />
      </Icon>
    </Button>
  ) : null,
  [PIECE_ACTION_NAMES.expect]: (
    <Button
      disabled={actionsDisabled[PIECE_ACTION_NAMES.expect]}
      buttonStyle="dropdownItem"
      data-testid="expect-piece-button"
      onClick={() => onStatusChange(PIECE_STATUS.expected)}
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
      onClick={onReceive}
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
      onClick={onCreateAnotherPiece}
    >
      <Icon icon="save">
        <FormattedMessage id="ui-receiving.piece.action.button.saveAndCreateAnother" />
      </Icon>
    </Button>
  ),
  [PIECE_ACTION_NAMES.sendClaim]: (
    <Button
      disabled={actionsDisabled[PIECE_ACTION_NAMES.sendClaim]}
      buttonStyle="dropdownItem"
      data-testid="send-claim-button"
      onClick={onClaimSend}
    >
      <Icon icon="envelope">
        <FormattedMessage id="ui-receiving.piece.action.button.sendClaim" />
      </Icon>
    </Button>
  ),
  [PIECE_ACTION_NAMES.unReceive]: (
    <Button
      disabled={actionsDisabled[PIECE_ACTION_NAMES.unReceive]}
      buttonStyle="dropdownItem"
      data-testid="unReceive-piece-button"
      onClick={onUnreceivePiece}
    >
      <Icon icon="cancel">
        <FormattedMessage id="ui-receiving.piece.action.button.unReceive" />
      </Icon>
    </Button>
  ),
  [PIECE_ACTION_NAMES.unReceivable]: (
    <Button
      disabled={actionsDisabled[PIECE_ACTION_NAMES.unReceivable]}
      buttonStyle="dropdownItem"
      data-testid="unReceivable-piece-button"
      onClick={() => onStatusChange(PIECE_STATUS.unreceivable)}
    >
      <Icon icon="cancel">
        <FormattedMessage id="ui-receiving.piece.action.button.unReceivable" />
      </Icon>
    </Button>
  ),
});
