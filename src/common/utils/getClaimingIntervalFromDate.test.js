import moment from 'moment';

import { getClaimingIntervalFromDate } from './getClaimingIntervalFromDate';

describe('getClaimingIntervalFromDate', () => {
  it('should return claiming interval calculated based on provided date', () => {
    const today = moment().startOf('day');

    expect(getClaimingIntervalFromDate(today)).toEqual(0);
    expect(getClaimingIntervalFromDate(today.add(5, 'days'))).toEqual(5);
  });
});
