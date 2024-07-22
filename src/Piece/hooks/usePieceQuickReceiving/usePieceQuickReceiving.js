import noop from 'lodash/noop';
import {
  useCallback,
  useRef,
} from 'react';

import {
  ORDER_STATUSES,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';
import { useOkapiKy } from '@folio/stripes/core';

import { useReceive } from '../../../common/hooks';
import { extendKyWithTenant, getItemById, getPieceById, getPieceStatusFromItem, getReceivingPieceItemStatus, handleReceiveErrorResponse } from '../../../common/utils';

export const usePieceQuickReceiving = ({
  order,
  tenantId,
}) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const showCallout = useShowCallout();
  const [isConfirmReceiving, toggleConfirmReceiving] = useModalToggle();

  const confirmReceivingPromise = useRef(Promise);
  const isOrderClosed = order?.workflowStatus === ORDER_STATUSES.closed;

  const { receive } = useReceive({ tenantId });

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

    return receive([{ ...piece, ...itemData }]);
  }, [ky, receive, tenantId]);

  const handleQuickReceive = useCallback((values, mutationFn) => {
    return quickReceive(values, mutationFn)
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
        console.log(e);
        handleReceiveErrorResponse(showCallout, e.response);
      });
  }, [quickReceive, showCallout]);

  const confirmReceiving = useCallback(
    () => new Promise((resolve, reject) => {
      confirmReceivingPromise.current = { resolve, reject };
      toggleConfirmReceiving();
    }),
    [toggleConfirmReceiving],
  );

  const onQuickReceive = useCallback((values) => {
    return isOrderClosed
      ? confirmReceiving().then(() => handleQuickReceive(values), noop)
      : handleQuickReceive(values);
  }, [confirmReceiving, handleQuickReceive, isOrderClosed]);

  const onConfirmReceive = () => {
    confirmReceivingPromise.current.resolve();
    toggleConfirmReceiving();
  };

  const onCancelReceive = () => {
    confirmReceivingPromise.current.reject();
    toggleConfirmReceiving();
  };

  return {
    isConfirmReceiving,
    onQuickReceive,
    onCancelReceive,
    onConfirmReceive,
  };
};
