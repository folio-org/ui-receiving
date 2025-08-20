import { FormattedMessage } from 'react-intl';

import { isSameOrBeforeDay } from '../../utils';

export const validateClaimingDate = (value) => {
  return isSameOrBeforeDay(value)
    ? <FormattedMessage id="ui-receiving.validation.dateAfter" />
    : undefined;
};

export const excludeClaimingPreviousDays = (day) => {
  return isSameOrBeforeDay(day);
};
