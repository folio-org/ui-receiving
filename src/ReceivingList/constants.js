import {
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

export const FILTERS = {
  ACQUISITIONS_UNIT: 'purchaseOrder.acqUnitIds',
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
