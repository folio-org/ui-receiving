import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

export const PIECE_STATUS = {
  received: 'Received',
  expected: 'Expected',
  late: 'Late',
  claimDelayed: 'Claim delayed',
  claimSent: 'Claim sent',
  unreceivable: 'Unreceivable',
};

export const PIECE_ACTION_NAMES = {
  saveAndCreate: 'saveAndCreate',
  quickReceive: 'quickReceive',
  sendClaim: 'sendClaim',
  delayClaim: 'delayClaim',
  unReceivable: 'unReceivable',
  expect: 'expect',
  delete: 'delete',
};

export const PIECE_ACTIONS_BY_STATUS = {
  [PIECE_STATUS.expected]: [
    PIECE_ACTION_NAMES.saveAndCreate,
    PIECE_ACTION_NAMES.quickReceive,
    PIECE_ACTION_NAMES.sendClaim,
    PIECE_ACTION_NAMES.delayClaim,
    PIECE_ACTION_NAMES.unReceivable,
    PIECE_ACTION_NAMES.delete,
  ],
  [PIECE_STATUS.received]: [
    PIECE_ACTION_NAMES.saveAndCreate,
    PIECE_ACTION_NAMES.unReceivable,
    PIECE_ACTION_NAMES.delete,
  ],
  [PIECE_STATUS.unreceivable]: [
    PIECE_ACTION_NAMES.saveAndCreate,
    PIECE_ACTION_NAMES.expect,
    PIECE_ACTION_NAMES.delete,
  ],
};

export const PIECE_ACTIONS = ({
  canDeletePiece,
  disabled,
  onCreateAnotherPiece,
  onDelete,
  onReceive,
}) => ({
  delayClaim: (
    <Button disabled={disabled} buttonStyle="dropdownItem">
      <Icon icon="calendar">
        <FormattedMessage id="ui-receiving.piece.action.button.delayClaim" />
      </Icon>
    </Button>
  ),
  delete: (
    <Button
      onClick={onDelete}
      buttonStyle="dropdownItem"
      data-testid="delete-piece-button"
      disabled={!canDeletePiece || disabled}
    >
      <Icon icon="trash">
        <FormattedMessage id="ui-receiving.piece.action.button.delete" />
      </Icon>
    </Button>
  ),
  expect: (
    <Button disabled={disabled} buttonStyle="dropdownItem">
      <Icon icon="calendar">
        <FormattedMessage id="ui-receiving.piece.action.button.expect" />
      </Icon>
    </Button>
  ),
  quickReceive: (
    <Button
      disabled={disabled}
      data-testid="quickReceive"
      buttonStyle="dropdownItem"
      onClick={onReceive}
    >
      <Icon icon="receive">
        <FormattedMessage id="ui-receiving.piece.action.button.quickReceive" />
      </Icon>
    </Button>
  ),
  saveAndCreate: (
    <Button
      disabled={disabled}
      buttonStyle="dropdownItem"
      onClick={onCreateAnotherPiece}
    >
      <Icon icon="save">
        <FormattedMessage id="ui-receiving.piece.action.button.saveAndCreateAnother" />
      </Icon>
    </Button>
  ),
  sendClaim: (
    <Button disabled={disabled} buttonStyle="dropdownItem">
      <Icon icon="envelope">
        <FormattedMessage id="ui-receiving.piece.action.button.sendClaim" />
      </Icon>
    </Button>
  ),
  unReceivable: (
    <Button disabled={disabled} buttonStyle="dropdownItem">
      <Icon icon="cancel">
        <FormattedMessage id="ui-receiving.piece.action.button.unReceivable" />
      </Icon>
    </Button>
  ),
});
