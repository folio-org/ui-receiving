import { FormattedMessage } from 'react-intl';

export const TITLE_ACCORDION = {
  boundItems: 'boundItems',
  expected: 'expected',
  information: 'information',
  polDetails: 'polDetails',
  received: 'received',
  unreceivable: 'unreceivable',
};

export const TITLE_ACCORDION_LABELS = {
  [TITLE_ACCORDION.boundItems]: <FormattedMessage id="ui-receiving.title.boundItems" />,
  [TITLE_ACCORDION.expected]: <FormattedMessage id="ui-receiving.title.expected" />,
  [TITLE_ACCORDION.information]: <FormattedMessage id="ui-receiving.title.information" />,
  [TITLE_ACCORDION.polDetails]: <FormattedMessage id="ui-receiving.title.polDetails" />,
  [TITLE_ACCORDION.received]: <FormattedMessage id="ui-receiving.title.received" />,
  [TITLE_ACCORDION.unreceivable]: <FormattedMessage id="ui-receiving.title.unreceivable" />,
};
