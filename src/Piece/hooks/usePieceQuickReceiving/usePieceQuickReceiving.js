import { useCallback } from 'react';

import { useShowCallout } from '@folio/stripes-acq-components';
import { useOkapiKy } from '@folio/stripes/core';

import { useReceive } from '../../../common/hooks';
import {
  extendKyWithTenant,
  getItemById,
  getPieceById,
  getPieceStatusFromItem,
  getReceivingPieceItemStatus,
  handleReceiveErrorResponse,
} from '../../../common/utils';

export const usePieceQuickReceiving = ({ tenantId } = {}) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const showCallout = useShowCallout();

  const {
    isLoading,
    receive,
  } = useReceive({ tenantId });

  const quickReceive = useCallback(async (pieceValues) => {
    const { id } = pieceValues;
    const kyExtended = extendKyWithTenant(ky, pieceValues.receivingTenantId || tenantId);
    const piece = await getPieceById({ GET: ({ path }) => ky.get(path) })(id).then(res => res.json());

    const itemId = piece?.itemId;
    const item = itemId ? await getItemById(kyExtended)(itemId) : {};

    const itemData = itemId
      ? {
        itemId,
        itemStatus: getReceivingPieceItemStatus({ itemStatus: getPieceStatusFromItem(item) }),
      }
      : {};

    return receive({ pieces: [{ ...piece, ...itemData }] });
  }, [ky, receive, tenantId]);

  const onQuickReceive = useCallback((values) => {
    return quickReceive(values)
      .then((res) => {
        if (!values.id) {
          showCallout({
            messageId: 'ui-receiving.piece.actions.savePiece.success',
            type: 'success',
          });
        }

        showCallout({
          messageId: 'ui-receiving.piece.actions.checkInItem.success',
          type: 'success',
          values: { enumeration: values.enumeration },
        });

        return res;
      })
      .catch((e) => {
        handleReceiveErrorResponse(showCallout, e.response);
      });
  }, [quickReceive, showCallout]);

  return {
    isLoading,
    onQuickReceive,
  };
};
