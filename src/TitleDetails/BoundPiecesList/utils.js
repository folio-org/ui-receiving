import {
  getItemStatusLabel,
  ITEM_STATUS,
} from '@folio/stripes-acq-components';
import { NoValue, TextLink } from '@folio/stripes/components';

import { PIECE_COLUMNS } from '../constants';

export const getColumnFormatter = (hasViewInventoryPermissions, instanceId) => {
  return ({
    [PIECE_COLUMNS.barcode]: record => {
      const { barcode, itemId, holdingsRecordId } = record;

      if (!barcode) return <NoValue />;

      if (!hasViewInventoryPermissions) return barcode;

      if (instanceId && holdingsRecordId && itemId) {
        return <TextLink target="_blank" to={`/inventory/view/${instanceId}/${holdingsRecordId}/${itemId}`}>{barcode}</TextLink>;
      }

      return barcode;
    },
    [PIECE_COLUMNS.itemStatus]: record => (record.itemStatus ? getItemStatusLabel(record.itemStatus) : `${ITEM_STATUS.undefined}`),
    [PIECE_COLUMNS.displaySummary]: record => record.displaySummary || <NoValue />,
    [PIECE_COLUMNS.callNumber]: record => record.callNumber || <NoValue />,
  });
};
