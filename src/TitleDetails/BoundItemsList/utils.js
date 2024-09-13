import { FormattedMessage } from 'react-intl';

import { getItemStatusLabel } from '@folio/stripes-acq-components';
import {
  NoValue,
  TextLink,
} from '@folio/stripes/components';

import { getPieceStatusFromItem } from '../../common/utils';
import { PIECE_COLUMNS } from '../../Piece';

export const getColumnFormatter = (hasViewInventoryPermissions, instanceId, activeTenantId) => {
  return ({
    [PIECE_COLUMNS.barcode]: record => {
      const { barcode, id, holdingsRecordId, tenantId } = record;
      const isForeignTenant = tenantId && activeTenantId && activeTenantId !== tenantId;

      const isLink = (
        instanceId
        && holdingsRecordId
        && id
        && hasViewInventoryPermissions
        && !isForeignTenant
      );

      if (isLink) {
        const barcodeText = barcode || <FormattedMessage id="ui-receiving.piece.barcode.noBarcode" />;

        return (
          <TextLink
            target="_blank"
            to={`/inventory/view/${instanceId}/${holdingsRecordId}/${id}`}
          >
            {barcodeText}
          </TextLink>
        );
      }

      return barcode || <NoValue />;
    },
    [PIECE_COLUMNS.itemStatus]: record => getItemStatusLabel(getPieceStatusFromItem(record)) || <NoValue />,
    [PIECE_COLUMNS.displaySummary]: record => record.displaySummary || <NoValue />,
    [PIECE_COLUMNS.callNumber]: record => record.itemLevelCallNumber || <NoValue />,
  });
};
