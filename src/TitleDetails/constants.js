import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

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

export const PIECE_STATUS = {
  expected: 'Expected',
  received: 'Received',
};

export const PIECE_FORMAT = {
  electronic: 'Electronic',
  physical: 'Physical',
  other: 'Other',
};

export const PIECE_FORMAT_OPTIONS = [
  { labelId: 'ui-receiving.piece.pieceFormat.electronic', value: PIECE_FORMAT.electronic },
  { labelId: 'ui-receiving.piece.pieceFormat.physical', value: PIECE_FORMAT.physical },
];

export const ORDER_FORMAT_TO_PIECE_FORMAT = {
  [ORDER_FORMATS.electronicResource]: PIECE_FORMAT.electronic,
  [ORDER_FORMATS.physicalResource]: PIECE_FORMAT.physical,
  [ORDER_FORMATS.other]: PIECE_FORMAT.other,
};

export const INVENTORY_RECORDS_TYPE = {
  all: 'Instance, Holding, Item',
  instance: 'Instance',
  instanceAndHolding: 'Instance, Holding',
  none: 'None',
};

export const ITEM_STATUS = {
  inProcess: 'In process',
  onOrder: 'On order',
  available: 'Available',
  inTransit: 'In transit',
  orderClosed: 'Order closed',
  undefined: 'Undefined',
};
