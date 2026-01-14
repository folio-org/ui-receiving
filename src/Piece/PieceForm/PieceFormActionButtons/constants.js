import without from 'lodash/without';

import { PIECE_STATUS } from '@folio/stripes-acq-components';

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
