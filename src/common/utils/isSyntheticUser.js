import { CLAIMING_JOB_SYNTHETIC_USER_ID } from '../constants';

export const isSyntheticUser = (userId) => {
  return userId === CLAIMING_JOB_SYNTHETIC_USER_ID;
};
