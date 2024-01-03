import omit from 'lodash/omit';
import pick from 'lodash/pick';
import { FormattedMessage } from 'react-intl';

import { NoValue } from '@folio/stripes/components';
import {
  ORDER_FORMATS,
  PIECE_FORMAT,
  PIECE_FORMAT_LABELS,
  PIECE_STATUS,
} from '@folio/stripes-acq-components';

export const TITLE_ACCORDION = {
  information: 'information',
  polDetails: 'polDetails',
  expected: 'expected',
  received: 'received',
  unreceivable: 'unreceivable',
};

export const TITLE_ACCORDION_LABELS = {
  [TITLE_ACCORDION.information]: <FormattedMessage id="ui-receiving.title.information" />,
  [TITLE_ACCORDION.polDetails]: <FormattedMessage id="ui-receiving.title.polDetails" />,
  [TITLE_ACCORDION.expected]: <FormattedMessage id="ui-receiving.title.expected" />,
  [TITLE_ACCORDION.received]: <FormattedMessage id="ui-receiving.title.received" />,
  [TITLE_ACCORDION.unreceivable]: <FormattedMessage id="ui-receiving.title.unreceivable" />,
};

export const ORDER_FORMAT_TO_PIECE_FORMAT = {
  [ORDER_FORMATS.electronicResource]: PIECE_FORMAT.electronic,
  [ORDER_FORMATS.physicalResource]: PIECE_FORMAT.physical,
  [ORDER_FORMATS.other]: PIECE_FORMAT.other,
};

export const PIECE_COLUMNS = {
  caption: 'caption',
  callNumber: 'callNumber',
  chronology: 'chronology',
  copyNumber: 'copyNumber',
  enumeration: 'enumeration',
  receiptDate: 'receiptDate',
  receivedDate: 'receivedDate',
  comment: 'comment',
  format: 'format',
  request: 'request',
  barcode: 'barcode',
  location: 'location',
  status: 'status',
};

const PIECE_VISIBLE_COLUMNS = [
  PIECE_COLUMNS.caption,
  PIECE_COLUMNS.copyNumber,
  PIECE_COLUMNS.enumeration,
  PIECE_COLUMNS.chronology,
  PIECE_COLUMNS.comment,
  PIECE_COLUMNS.format,
];

export const SORTABLE_COLUMNS = [PIECE_COLUMNS.enumeration, PIECE_COLUMNS.receiptDate, PIECE_COLUMNS.receivedDate];

export const EXPECTED_PIECE_VISIBLE_COLUMNS = [
  PIECE_COLUMNS.caption,
  PIECE_COLUMNS.status,
  ...PIECE_VISIBLE_COLUMNS.slice(1),
  PIECE_COLUMNS.receiptDate,
  PIECE_COLUMNS.request,
];

export const RECEIVED_PIECE_VISIBLE_COLUMNS = [
  PIECE_COLUMNS.barcode,
  ...PIECE_VISIBLE_COLUMNS,
  PIECE_COLUMNS.receivedDate,
  PIECE_COLUMNS.request,
];

export const UNRECEIVABLE_PIECE_VISIBLE_COLUMNS = [...RECEIVED_PIECE_VISIBLE_COLUMNS];

export const PIECE_COLUMN_MAPPING = {
  [PIECE_COLUMNS.copyNumber]: <FormattedMessage id="ui-receiving.piece.copyNumber" />,
  [PIECE_COLUMNS.chronology]: <FormattedMessage id="ui-receiving.piece.chronology" />,
  [PIECE_COLUMNS.caption]: <FormattedMessage id="ui-receiving.piece.caption" />,
  barcode: <FormattedMessage id="ui-receiving.piece.barcode" />,
  [PIECE_COLUMNS.enumeration]: <FormattedMessage id="ui-receiving.piece.enumeration" />,
  format: <FormattedMessage id="ui-receiving.piece.format" />,
  [PIECE_COLUMNS.receiptDate]: <FormattedMessage id="ui-receiving.piece.receiptDate" />,
  [PIECE_COLUMNS.receivedDate]: <FormattedMessage id="ui-receiving.piece.receivedDate" />,
  [PIECE_COLUMNS.comment]: <FormattedMessage id="ui-receiving.piece.comment" />,
  request: <FormattedMessage id="ui-receiving.piece.request" />,
  selection: null,
  arrow: null,
  [PIECE_COLUMNS.status]: <FormattedMessage id="ui-receiving.piece.status" />,
};

export const PIECE_COLUMN_BASE_FORMATTER = {
  [PIECE_COLUMNS.request]: record => (record.request ? <FormattedMessage id="ui-receiving.piece.request.isOpened" /> : <NoValue />),
  [PIECE_COLUMNS.format]: ({ format }) => PIECE_FORMAT_LABELS[format],
  [PIECE_COLUMNS.callNumber]: record => record.callNumber || <NoValue />,
  [PIECE_COLUMNS.caption]: record => record.caption || <NoValue />,
  [PIECE_COLUMNS.copyNumber]: record => record.copyNumber || <NoValue />,
  [PIECE_COLUMNS.barcode]: record => record.barcode || <NoValue />,
  [PIECE_COLUMNS.status]: record => record.receivingStatus || <NoValue />,
};

export const EXPECTED_PIECE_COLUMN_MAPPING = pick(PIECE_COLUMN_MAPPING, EXPECTED_PIECE_VISIBLE_COLUMNS);
export const RECEIVED_PIECE_COLUMN_MAPPING = pick(PIECE_COLUMN_MAPPING, RECEIVED_PIECE_VISIBLE_COLUMNS);
export const UNRECEIVABLE_PIECE_COLUMN_MAPPING = {
  ...pick(PIECE_COLUMN_MAPPING, UNRECEIVABLE_PIECE_VISIBLE_COLUMNS),
  [PIECE_COLUMNS.callNumber]: <FormattedMessage id="ui-receiving.piece.callNumber" />,
};

export const MENU_FILTERS = {
  supplement: 'supplement',
};

export const SUPPLEMENT_MENU_FILTER_OPTIONS = [
  {
    value: 'true',
    label: <FormattedMessage id="ui-receiving.filter.supplements" />,
  },
  {
    value: 'false',
    label: <FormattedMessage id="ui-receiving.filter.nonSupplements" />,
  },
];

export const EXPECTED_PIECES_STATUSES = Object.values(omit(PIECE_STATUS, ['received', 'unreceivable']));
export const EXPECTED_PIECES_SEARCH_VALUE = EXPECTED_PIECES_STATUSES.map(status => `"${status}"`).join(' or ');
export const PIECE_MODAL_ACCORDION = {
  metadata: 'metadata',
  pieceDetails: 'pieceDetails',
  itemDetails: 'itemDetails',
  statusChangeLog: 'statusChangeLog',
};

export const PIECE_MODAL_ACCORDION_LABELS = {
  [PIECE_MODAL_ACCORDION.pieceDetails]: <FormattedMessage id="ui-receiving.piece.accordion.pieceDetails" />,
  [PIECE_MODAL_ACCORDION.itemDetails]: <FormattedMessage id="ui-receiving.piece.accordion.itemDetails" />,
  [PIECE_MODAL_ACCORDION.statusChangeLog]: <FormattedMessage id="ui-receiving.piece.accordion.statusChangeLog" />,
};
