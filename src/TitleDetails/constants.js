import React from 'react';
import { FormattedMessage } from 'react-intl';

export const TITLE_ACCORDION = {
  information: 'information',
  expected: 'expected',
  received: 'received',
};

export const TITLE_ACCORDION_LABELS = {
  [TITLE_ACCORDION.information]: <FormattedMessage id="ui-receiving.title.information" />,
  [TITLE_ACCORDION.expected]: <FormattedMessage id="ui-receiving.title.expected" />,
  [TITLE_ACCORDION.received]: <FormattedMessage id="ui-receiving.title.received" />,
};
