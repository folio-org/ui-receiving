import { ITEM_STATUS } from '@folio/stripes-acq-components';

import { getReceivingPieceItemStatus } from './getReceivingPieceItemStatus';

const CHECKED_OUT = 'Checked out';

describe('getReceivingPieceItemStatus', () => {
  it('should return new status \'In process\' if piece related item\'s status is either \'On order\' or \'Order closed\'', () => {
    expect(getReceivingPieceItemStatus({ itemStatus: ITEM_STATUS.onOrder })).toEqual(ITEM_STATUS.inProcess);
    expect(getReceivingPieceItemStatus({ itemStatus: ITEM_STATUS.orderClosed })).toEqual(ITEM_STATUS.inProcess);
  });

  it('should return current piece related item\'s status if it is neither \'On order\' or \'Order closed\'', () => {
    expect(getReceivingPieceItemStatus({ itemStatus: ITEM_STATUS.inTransit })).toEqual(ITEM_STATUS.inTransit);
    expect(getReceivingPieceItemStatus({ itemStatus: CHECKED_OUT })).toEqual(CHECKED_OUT);
  });
});
