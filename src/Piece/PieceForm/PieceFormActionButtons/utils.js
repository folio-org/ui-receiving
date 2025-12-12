import {
  PIECE_ACTIONS,
  PIECE_ACTIONS_BY_STATUS,
} from './constants';

export const getPieceActionMenu = ({ status, ...rest }) => {
  const actions = PIECE_ACTIONS_BY_STATUS[status];

  if (!actions) {
    return [];
  }

  return actions
    .map(action => PIECE_ACTIONS(rest)[action])
    .filter(Boolean);
};
