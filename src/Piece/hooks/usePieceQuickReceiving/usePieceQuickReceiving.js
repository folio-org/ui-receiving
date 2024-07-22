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

import { useQuickReceive } from '../../../common/hooks';
import { handleReceiveErrorResponse } from '../../../common/utils';

export const usePieceQuickReceiving = ({
  order,
  tenantId,
}) => {
  const showCallout = useShowCallout();
  const [isConfirmReceiving, toggleConfirmReceiving] = useModalToggle();

  const confirmReceivingPromise = useRef(Promise);
  const isOrderClosed = order?.workflowStatus === ORDER_STATUSES.closed;

  const { quickReceive } = useQuickReceive({ tenantId });

  const confirmReceiving = useCallback(
    () => new Promise((resolve, reject) => {
      confirmReceivingPromise.current = { resolve, reject };
      toggleConfirmReceiving();
    }),
    [toggleConfirmReceiving],
  );

  const handleQuickReceive = useCallback((values) => {
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
      .catch(({ response }) => {
        handleReceiveErrorResponse(showCallout, response);
      });
  }, [quickReceive, showCallout]);

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
