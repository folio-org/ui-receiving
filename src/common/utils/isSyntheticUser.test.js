import { SYNTHETIC_USER_ID } from '../constants';
import { isSyntheticUser } from './isSyntheticUser';

describe('isSyntheticUser', () => {
  it('should return "false" for the common user', () => {
    expect(isSyntheticUser('06c3485f-631c-427e-bade-5e763636c472')).toBeFalsy();
    expect(isSyntheticUser('08c3485f-631c-427e-bade-5e763636c470')).toBeFalsy();
    expect(isSyntheticUser('02c3485f-631c-427e-bade-5e763636c471')).toBeFalsy();
  });

  it('should return "true" for the synthetic user', () => {
    expect(isSyntheticUser(SYNTHETIC_USER_ID)).toBeTruthy();
  });
});
