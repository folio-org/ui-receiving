import moment from 'moment';

export const getClaimingIntervalFromDate = (date) => {
  const currentDay = moment().startOf('day');

  return moment(date).diff(currentDay, 'days');
};
