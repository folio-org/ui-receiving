import {
  getItemStatusLabel,
  ITEM_STATUS,
} from '@folio/stripes-acq-components';
import { NoValue } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

export const PIECE_COLUMNS = {
  displaySummary: 'displaySummary',
  checked: 'checked',
  enumeration: 'enumeration',
  chronology: 'chronology',
  copyNumber: 'copyNumber',
  accessionNumber: 'accessionNumber',
  barcode: 'barcode',
  itemStatus: 'itemStatus',
  callNumber: 'callNumber',
};

export const PIECE_COLUMN_MAPPING = {
  [PIECE_COLUMNS.displaySummary]: <FormattedMessage id="ui-receiving.piece.displaySummary" />,
  [PIECE_COLUMNS.enumeration]: <FormattedMessage id="ui-receiving.piece.enumeration" />,
  [PIECE_COLUMNS.chronology]: <FormattedMessage id="ui-receiving.piece.chronology" />,
  [PIECE_COLUMNS.copyNumber]: <FormattedMessage id="ui-receiving.piece.copyNumber" />,
  [PIECE_COLUMNS.accessionNumber]: <FormattedMessage id="ui-receiving.piece.accessionNumber" />,
  [PIECE_COLUMNS.barcode]: <FormattedMessage id="ui-receiving.piece.barcode" />,
  [PIECE_COLUMNS.itemStatus]: <FormattedMessage id="ui-receiving.piece.itemStatus" />,
  [PIECE_COLUMNS.callNumber]: <FormattedMessage id="ui-receiving.piece.callNumber" />,
};

export const VISIBLE_COLUMNS = [
  PIECE_COLUMNS.checked,
  PIECE_COLUMNS.displaySummary,
  PIECE_COLUMNS.enumeration,
  PIECE_COLUMNS.chronology,
  PIECE_COLUMNS.copyNumber,
  PIECE_COLUMNS.accessionNumber,
  PIECE_COLUMNS.barcode,
  PIECE_COLUMNS.itemStatus,
  PIECE_COLUMNS.callNumber,
];

export const COLUMN_FORMATTER = {
  [PIECE_COLUMNS.displaySummary]: record => record.displaySummary || <NoValue />,
  [PIECE_COLUMNS.enumeration]: record => record.enumeration || <NoValue />,
  [PIECE_COLUMNS.chronology]: record => record.chronology || <NoValue />,
  [PIECE_COLUMNS.copyNumber]: record => record.copyNumber || <NoValue />,
  [PIECE_COLUMNS.accessionNumber]: record => record.accessionNumber || <NoValue />,
  [PIECE_COLUMNS.barcode]: record => record.barcode || <NoValue />,
  [PIECE_COLUMNS.itemStatus]: record => (record.itemStatus ? getItemStatusLabel(record.itemStatus) : `${ITEM_STATUS.undefined}`),
  [PIECE_COLUMNS.callNumber]: record => record.callNumber || <NoValue />,
};

export const PIECE_FORM_FIELD_NAMES = {
  barcode: 'bindItem.barcode',
  callNumber: 'bindItem.callNumber',
  materialTypeId: 'bindItem.materialTypeId',
  permanentLoanTypeId: 'bindItem.permanentLoanTypeId',
  locationId: 'bindItem.locationId',
};

export const REQUIRED_FIELDS = [
  PIECE_FORM_FIELD_NAMES.materialTypeId,
  PIECE_FORM_FIELD_NAMES.permanentLoanTypeId,
  PIECE_FORM_FIELD_NAMES.locationId,
];

export const TRANSFER_REQUEST_ACTIONS = {
  cancel: 'Cancel',
  notTransfer: 'Do Nothing',
  transfer: 'Transfer',
};
