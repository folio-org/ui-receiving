import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  ORDER_FORMATS,
  PIECE_FORMAT,
} from '@folio/stripes-acq-components';

export const TITLE_ACCORDION = {
  information: 'information',
  polDetails: 'polDetails',
  expected: 'expected',
  received: 'received',
};

export const TITLE_ACCORDION_LABELS = {
  [TITLE_ACCORDION.information]: <FormattedMessage id="ui-receiving.title.information" />,
  [TITLE_ACCORDION.polDetails]: <FormattedMessage id="ui-receiving.title.polDetails" />,
  [TITLE_ACCORDION.expected]: <FormattedMessage id="ui-receiving.title.expected" />,
  [TITLE_ACCORDION.received]: <FormattedMessage id="ui-receiving.title.received" />,
};

export const ORDER_FORMAT_TO_PIECE_FORMAT = {
  [ORDER_FORMATS.electronicResource]: PIECE_FORMAT.electronic,
  [ORDER_FORMATS.physicalResource]: PIECE_FORMAT.physical,
  [ORDER_FORMATS.other]: PIECE_FORMAT.other,
};

export const PIECE_COLUMNS = {
  caption: 'caption',
  receiptDate: 'receiptDate',
  receivedDate: 'receivedDate',
};
