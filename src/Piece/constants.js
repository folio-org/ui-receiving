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

import { PIECE_FORM_FIELD_NAMES } from '../common/constants';

export const ORDER_FORMAT_TO_PIECE_FORMAT = {
  [ORDER_FORMATS.electronicResource]: PIECE_FORMAT.electronic,
  [ORDER_FORMATS.physicalResource]: PIECE_FORMAT.physical,
  [ORDER_FORMATS.other]: PIECE_FORMAT.other,
};

export const PIECE_FORM_SERVICE_FIELD_NAMES = {
  deleteHolding: 'deleteHolding',
  isCreateAnother: 'isCreateAnother',
  postSubmitAction: 'postSubmitAction',
  nextReceivingStatus: 'nextReceivingStatus',
};

export const PIECE_FORM_CHECKBOX_FIELD_NAMES = [
  PIECE_FORM_FIELD_NAMES.discoverySuppress,
  PIECE_FORM_FIELD_NAMES.displayOnHolding,
  PIECE_FORM_FIELD_NAMES.displayToPublic,
  PIECE_FORM_FIELD_NAMES.isBound,
  PIECE_FORM_FIELD_NAMES.isCreateItem,
  PIECE_FORM_FIELD_NAMES.supplement,
];

export const PIECE_COLUMNS = {
  accessionNumber: 'accessionNumber',
  barcode: 'barcode',
  callNumber: 'callNumber',
  checked: 'checked',
  chronology: 'chronology',
  comment: 'comment',
  copyNumber: 'copyNumber',
  displayOnHolding: 'displayOnHolding',
  displaySummary: 'displaySummary',
  displayToPublic: 'displayToPublic',
  enumeration: 'enumeration',
  format: 'format',
  isCreateItem: 'isCreateItem',
  itemStatus: 'itemStatus',
  location: 'location',
  locationName: 'locationName',
  receiptDate: 'receiptDate',
  receivedDate: 'receivedDate',
  request: 'request',
  sequenceNumber: 'sequenceNumber',
  status: 'status',
  supplement: 'supplement',
};

const PIECE_VISIBLE_COLUMNS = [
  PIECE_COLUMNS.sequenceNumber,
  PIECE_COLUMNS.displaySummary,
  PIECE_COLUMNS.copyNumber,
  PIECE_COLUMNS.enumeration,
  PIECE_COLUMNS.chronology,
  PIECE_COLUMNS.comment,
  PIECE_COLUMNS.format,
];

export const SORTABLE_COLUMNS = [
  PIECE_COLUMNS.sequenceNumber,
  PIECE_COLUMNS.enumeration,
  PIECE_COLUMNS.receiptDate,
  PIECE_COLUMNS.receivedDate,
];

export const EXPECTED_PIECE_VISIBLE_COLUMNS = [
  PIECE_COLUMNS.sequenceNumber,
  PIECE_COLUMNS.displaySummary,
  PIECE_COLUMNS.status,
  ...PIECE_VISIBLE_COLUMNS.slice(2),
  PIECE_COLUMNS.receiptDate,
  PIECE_COLUMNS.locationName,
  PIECE_COLUMNS.displayToPublic,
  PIECE_COLUMNS.request,
];

export const RECEIVED_PIECE_VISIBLE_COLUMNS = [
  PIECE_COLUMNS.sequenceNumber,
  PIECE_COLUMNS.barcode,
  ...PIECE_VISIBLE_COLUMNS.slice(1),
  PIECE_COLUMNS.receivedDate,
  PIECE_COLUMNS.locationName,
  PIECE_COLUMNS.displayToPublic,
  PIECE_COLUMNS.request,
];

export const UNRECEIVABLE_PIECE_VISIBLE_COLUMNS = [...RECEIVED_PIECE_VISIBLE_COLUMNS];

export const PIECE_COLUMN_MAPPING = {
  arrow: null,
  selection: null,
  [PIECE_COLUMNS.accessionNumber]: <FormattedMessage id="ui-receiving.piece.accessionNumber" />,
  [PIECE_COLUMNS.barcode]: <FormattedMessage id="ui-receiving.piece.barcode" />,
  [PIECE_COLUMNS.callNumber]: <FormattedMessage id="ui-receiving.piece.callNumber" />,
  [PIECE_COLUMNS.displaySummary]: <FormattedMessage id="ui-receiving.piece.displaySummary" />,
  [PIECE_COLUMNS.displayToPublic]: <FormattedMessage id="ui-receiving.piece.displayToPublic" />,
  [PIECE_COLUMNS.chronology]: <FormattedMessage id="ui-receiving.piece.chronology" />,
  [PIECE_COLUMNS.comment]: <FormattedMessage id="ui-receiving.piece.comment" />,
  [PIECE_COLUMNS.copyNumber]: <FormattedMessage id="ui-receiving.piece.copyNumber" />,
  [PIECE_COLUMNS.displayOnHolding]: <FormattedMessage id="ui-receiving.piece.displayOnHolding" />,
  [PIECE_COLUMNS.enumeration]: <FormattedMessage id="ui-receiving.piece.enumeration" />,
  [PIECE_COLUMNS.format]: <FormattedMessage id="ui-receiving.piece.format" />,
  [PIECE_COLUMNS.isCreateItem]: <FormattedMessage id="ui-receiving.piece.createItem" />,
  [PIECE_COLUMNS.location]: <FormattedMessage id="ui-receiving.piece.location" />,
  [PIECE_COLUMNS.locationName]: <FormattedMessage id="ui-receiving.piece.columns.location" />,
  [PIECE_COLUMNS.receiptDate]: <FormattedMessage id="ui-receiving.piece.receiptDate" />,
  [PIECE_COLUMNS.receivedDate]: <FormattedMessage id="ui-receiving.piece.receivedDate" />,
  [PIECE_COLUMNS.request]: <FormattedMessage id="ui-receiving.piece.request" />,
  [PIECE_COLUMNS.status]: <FormattedMessage id="ui-receiving.piece.status" />,
  [PIECE_COLUMNS.itemStatus]: <FormattedMessage id="ui-receiving.piece.status" />,
  [PIECE_COLUMNS.sequenceNumber]: <FormattedMessage id="ui-receiving.piece.sequence" />,
  [PIECE_COLUMNS.supplement]: <FormattedMessage id="ui-receiving.piece.supplement" />,
};

export const PIECE_COLUMN_BASE_FORMATTER = {
  [PIECE_COLUMNS.request]: record => (record.request ? <FormattedMessage id="ui-receiving.piece.request.isOpened" /> : <NoValue />),
  [PIECE_COLUMNS.format]: ({ format }) => PIECE_FORMAT_LABELS[format],
  [PIECE_COLUMNS.callNumber]: record => record.callNumber || <NoValue />,
  [PIECE_COLUMNS.displaySummary]: record => record.displaySummary || <NoValue />,
  [PIECE_COLUMNS.copyNumber]: record => record.copyNumber || <NoValue />,
  [PIECE_COLUMNS.barcode]: record => record.barcode || <NoValue />,
  [PIECE_COLUMNS.sequenceNumber]: record => record.sequenceNumber || <NoValue />,
  [PIECE_COLUMNS.status]: record => record.receivingStatus || <NoValue />,
};

export const EXPECTED_PIECE_COLUMN_MAPPING = pick(PIECE_COLUMN_MAPPING, EXPECTED_PIECE_VISIBLE_COLUMNS);
export const RECEIVED_PIECE_COLUMN_MAPPING = pick(PIECE_COLUMN_MAPPING, RECEIVED_PIECE_VISIBLE_COLUMNS);
export const UNRECEIVABLE_PIECE_COLUMN_MAPPING = {
  ...pick(PIECE_COLUMN_MAPPING, UNRECEIVABLE_PIECE_VISIBLE_COLUMNS),
  [PIECE_COLUMNS.callNumber]: <FormattedMessage id="ui-receiving.piece.callNumber" />,
};

export const MENU_FILTERS = {
  bound: 'isBound',
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

export const BOUND_MENU_FILTER_OPTIONS = [
  {
    value: 'true',
    label: <FormattedMessage id="ui-receiving.filter.bound" />,
  },
  {
    value: 'false',
    label: <FormattedMessage id="ui-receiving.filter.notBound" />,
  },
];

export const EXPECTED_PIECES_STATUSES = Object.values(omit(PIECE_STATUS, ['received', 'unreceivable']));
export const EXPECTED_PIECES_SEARCH_VALUE = EXPECTED_PIECES_STATUSES.map(status => `"${status}"`).join(' or ');
export const PIECE_MODAL_ACCORDION = {
  metadata: 'metadata',
  pieceDetails: 'pieceDetails',
  itemDetails: 'itemDetails',
  originalItemDetails: 'originalItemDetails',
  statusChangeLog: 'statusChangeLog',
};

export const PIECE_MODAL_ACCORDION_LABELS = {
  [PIECE_MODAL_ACCORDION.pieceDetails]: <FormattedMessage id="ui-receiving.piece.accordion.pieceDetails" />,
  [PIECE_MODAL_ACCORDION.itemDetails]: <FormattedMessage id="ui-receiving.piece.accordion.itemDetails" />,
  [PIECE_MODAL_ACCORDION.originalItemDetails]: <FormattedMessage id="ui-receiving.piece.accordion.originalItemDetails" />,
  [PIECE_MODAL_ACCORDION.statusChangeLog]: <FormattedMessage id="ui-receiving.piece.accordion.statusChangeLog" />,
};

export const PIECE_ACTION_NAMES = {
  saveAndClose: 'saveAndClose',
  saveAndCreate: 'saveAndCreate',
  quickReceive: 'quickReceive',
  markLate: 'markLate',
  sendClaim: 'sendClaim',
  delayClaim: 'delayClaim',
  unReceivable: 'unReceivable',
  unReceive: 'unReceive',
  expect: 'expect',
  delete: 'delete',
};

export const EXPECTED_PIECES_ACTION_NAMES = {
  addPiece: 'addPiece',
  receive: 'receive',
};
