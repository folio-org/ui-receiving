import { FormattedMessage } from 'react-intl';

import {
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

export const RECEIVING_COLUMNS = {
  TITLE: 'title',
  EXPECTED_RECEIPT_DATE: 'poLine.physical.expectedReceiptDate',
  TITLE_OR_PACKAGE: 'poLine.titleOrPackage',
  PO_LINE_NUMBER: 'poLine.poLineNumber',
  RECEIVING_NOTE: 'poLine.receivingNote',
  LOCATIONS: 'locations',
  ORDER_WORKFLOW: 'orderWorkflow',
};

export const RECEIVING_VISIBLE_COLUMNS = [
  RECEIVING_COLUMNS.TITLE,
  RECEIVING_COLUMNS.EXPECTED_RECEIPT_DATE,
  RECEIVING_COLUMNS.TITLE_OR_PACKAGE,
  RECEIVING_COLUMNS.PO_LINE_NUMBER,
  RECEIVING_COLUMNS.RECEIVING_NOTE,
  RECEIVING_COLUMNS.LOCATIONS,
  RECEIVING_COLUMNS.ORDER_WORKFLOW,
];

export const RECEIVING_MANDATORY_COLUMNS = [RECEIVING_COLUMNS.TITLE];

export const RECEIVING_COLUMN_MAPPING = {
  [RECEIVING_COLUMNS.TITLE]: <FormattedMessage id="ui-receiving.titles.title" />,
  [RECEIVING_COLUMNS.EXPECTED_RECEIPT_DATE]: <FormattedMessage id="ui-receiving.title.expectedReceiptDate" />,
  [RECEIVING_COLUMNS.TITLE_OR_PACKAGE]: <FormattedMessage id="ui-receiving.title.package" />,
  [RECEIVING_COLUMNS.PO_LINE_NUMBER]: <FormattedMessage id="ui-receiving.title.polNumber" />,
  [RECEIVING_COLUMNS.RECEIVING_NOTE]: <FormattedMessage id="ui-receiving.title.receivingNote" />,
  [RECEIVING_COLUMNS.LOCATIONS]: <FormattedMessage id="ui-receiving.title.locations" />,
  [RECEIVING_COLUMNS.ORDER_WORKFLOW]: <FormattedMessage id="ui-receiving.titles.orderWorkflow" />,
};

export const RECEIVING_SORTABLE_FIELDS = [
  RECEIVING_COLUMNS.TITLE,
  'poLine.receiptDate',
  RECEIVING_COLUMNS.TITLE_OR_PACKAGE,
  RECEIVING_COLUMNS.PO_LINE_NUMBER,
  RECEIVING_COLUMNS.RECEIVING_NOTE,
];

export const RECEIVING_COLUMN_MANAGER_ID = 'receiving-list';

export const FILTERS = {
  ACQUISITIONS_UNIT: 'purchaseOrder.acqUnitIds',
  BINDERY_ACTIVE: 'poLine.details.isBinderyActive',
  CREATED_BY: 'metadata.createdByUserId',
  DATE_CREATED: 'metadata.createdDate',
  DATE_UPDATED: 'metadata.updatedDate',
  EXPECTED_RECEIPT_DATE: 'pieces.receiptDate',
  LOCATION: 'poLine.locations',
  MATERIAL_TYPE: 'materialType',
  ORDER_FORMAT: 'poLine.orderFormat',
  ORDER_ORGANIZATION: 'purchaseOrder.vendor',
  ORDER_STATUS: 'purchaseOrder.workflowStatus',
  ORDER_TYPE: 'purchaseOrder.orderType',
  PIECE_CREATED_BY: 'pieces.metadata.createdByUserId',
  PIECE_DATE_CREATED: 'pieces.metadata.createdDate',
  PIECE_DATE_UPDATED: 'pieces.metadata.updatedDate',
  PIECE_UPDATED_BY: 'pieces.metadata.updatedByUserId',
  POL_TAGS: 'poLine.tags.tagList',
  RECEIPT_DUE: 'poLine.physical.receiptDue',
  RECEIVED_DATE: 'pieces.receivedDate',
  RECEIVING_STATUS: 'pieces.receivingStatus',
  RUSH: 'poLine.rush',
  UPDATED_BY: 'metadata.updatedByUserId',
};

export const ORDER_FORMAT_MATERIAL_TYPE_MAP = {
  [ORDER_FORMATS.electronicResource]: ['poLine.eresource.materialType'],
  [ORDER_FORMATS.physicalResource]: ['poLine.physical.materialType'],
  [ORDER_FORMATS.PEMix]: ['poLine.eresource.materialType', 'poLine.physical.materialType'],
  [ORDER_FORMATS.other]: ['poLine.physical.materialType'],
};
