import { getItemStatusLabel } from '@folio/stripes-acq-components';
import { NoValue, TextLink } from '@folio/stripes/components';

import { getPieceStatusFromItem } from '../../common/utils';
import { PIECE_COLUMNS } from '../../Piece';

export const getColumnFormatter = (hasViewInventoryPermissions, instanceId) => {
  return ({
    [PIECE_COLUMNS.barcode]: record => {
      const { barcode, id, holdingsRecordId } = record;

      if (!barcode) return <NoValue />;

      if (!hasViewInventoryPermissions) return barcode;

      if (instanceId && holdingsRecordId && id) {
        return <TextLink target="_blank" to={`/inventory/view/${instanceId}/${holdingsRecordId}/${id}`}>{barcode}</TextLink>;
      }

      return barcode;
    },
    [PIECE_COLUMNS.itemStatus]: record => getItemStatusLabel(getPieceStatusFromItem(record)) || <NoValue />,
    [PIECE_COLUMNS.displaySummary]: record => record.displaySummary || <NoValue />,
    [PIECE_COLUMNS.callNumber]: record => record.callNumber || <NoValue />,
  });
};
