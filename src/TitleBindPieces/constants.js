import {
  getItemStatusLabel,
  ITEM_STATUS,
} from '@folio/stripes-acq-components';
import { NoValue } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

export const COLUMN_NAMES = {
  yearCaption: 'yearCaption',
  checked: 'checked',
  enumeration: 'enumeration',
  chronology: 'chronology',
  copyNumber: 'copyNumber',
  accessionNumber: 'accessionNumber',
  barcode: 'barcode',
  itemStatus: 'itemStatus',
  callNumber: 'callNumber',
};

export const COLUMN_MAPPING = {
  [COLUMN_NAMES.yearCaption]: <FormattedMessage id="ui-receiving.piece.yearCaption" />,
  [COLUMN_NAMES.enumeration]: <FormattedMessage id="ui-receiving.piece.enumeration" />,
  [COLUMN_NAMES.chronology]: <FormattedMessage id="ui-receiving.piece.chronology" />,
  [COLUMN_NAMES.copyNumber]: <FormattedMessage id="ui-receiving.piece.copyNumber" />,
  [COLUMN_NAMES.accessionNumber]: <FormattedMessage id="ui-receiving.piece.accessionNumber" />,
  [COLUMN_NAMES.barcode]: <FormattedMessage id="ui-receiving.piece.barcode" />,
  [COLUMN_NAMES.itemStatus]: <FormattedMessage id="ui-receiving.piece.itemStatus" />,
  [COLUMN_NAMES.callNumber]: <FormattedMessage id="ui-receiving.piece.callNumber" />,
};

export const VISIBLE_COLUMNS = [
  COLUMN_NAMES.checked,
  COLUMN_NAMES.yearCaption,
  COLUMN_NAMES.enumeration,
  COLUMN_NAMES.chronology,
  COLUMN_NAMES.copyNumber,
  COLUMN_NAMES.accessionNumber,
  COLUMN_NAMES.barcode,
  COLUMN_NAMES.itemStatus,
  COLUMN_NAMES.callNumber,
];

export const COLUMN_FORMATTER = {
  [COLUMN_NAMES.yearCaption]: record => record.yearCaption?.join(', ') || <NoValue />,
  [COLUMN_NAMES.enumeration]: record => record.enumeration || <NoValue />,
  [COLUMN_NAMES.chronology]: record => record.chronology || <NoValue />,
  [COLUMN_NAMES.copyNumber]: record => record.copyNumber || <NoValue />,
  [COLUMN_NAMES.accessionNumber]: record => record.accessionNumber || <NoValue />,
  [COLUMN_NAMES.barcode]: record => record.barcode || <NoValue />,
  [COLUMN_NAMES.itemStatus]: record => (record.itemStatus ? getItemStatusLabel(record.itemStatus) : `${ITEM_STATUS.undefined}`),
  [COLUMN_NAMES.callNumber]: record => record.callNumber || <NoValue />,
};

export const TITLE_BIND_PIECES_FILED_NAMES = {
  barcode: 'barcode',
  callNumber: 'callNumber',
  materialType: 'materialType',
  permanentLoanType: 'permanentLoanType',
  permanentLocation: 'permanentLocation',
};
