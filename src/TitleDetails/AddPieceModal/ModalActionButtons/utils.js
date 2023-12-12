import { PIECE_ACTIONS, PIECE_ACTIONS_BY_STATUS } from './constants';

export const getPieceActionMenus = ({ status, disabled, ...rest }) => {
  const actions = PIECE_ACTIONS_BY_STATUS[status];

  if (!actions) {
    return [];
  }

  return actions.map(action => PIECE_ACTIONS({ disabled, ...rest })[action]);
};
