import { SYNTHETIC_USER_ID } from '../constants';

export const isSyntheticUser = (userId) => {
  return userId === SYNTHETIC_USER_ID;
};
