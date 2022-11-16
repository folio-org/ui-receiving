import { ITEM_STATUS } from '@folio/stripes-acq-components';

/**
 * If receiving piece related item has either `On order` or `Order closed` status,
 * then return new status `In process`, otherwise return current status of item.
 *
 * @param {Object} piece - piece to receive.
 * @returns {string} item status
 */
export const getReceivingPieceItemStatus = (piece) => {
  const changeableStatuses = [ITEM_STATUS.onOrder, ITEM_STATUS.orderClosed];

  return changeableStatuses.includes(piece.itemStatus)
    ? ITEM_STATUS.inProcess
    : piece.itemStatus;
};
