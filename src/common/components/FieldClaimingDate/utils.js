import moment from 'moment';
import { FormattedMessage } from 'react-intl';

const isSameOrBeforeDay = (day) => {
  const today = moment().startOf('day');

  return day.isSameOrBefore(today, 'day');
};

export const validateClaimingDate = (value) => {
  return isSameOrBeforeDay(moment(value))
    ? <FormattedMessage id="ui-receiving.validation.dateAfter" />
    : undefined;
};

export const excludePreviousDays = (day) => {
  return isSameOrBeforeDay(day);
};
