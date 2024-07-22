import {
  getItemStatusLabel,
  ITEM_STATUS,
} from '@folio/stripes-acq-components';
import { NoValue } from '@folio/stripes/components';

import { PIECE_COLUMNS } from '../Piece';

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
  holdingId: 'bindItem.holdingId',
  tenantId: 'bindItem.tenantId',
};

export const TRANSFER_REQUEST_ACTIONS = {
  cancel: 'Cancel',
  notTransfer: 'Do Nothing',
  transfer: 'Transfer',
};

export const ERROR_CODES = {
  bindItemMustIncludeEitherHoldingIdOrLocationId: 'bindItemMustIncludeEitherHoldingIdOrLocationId',
  generic: 'generic',
};
