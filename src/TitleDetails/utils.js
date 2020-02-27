import {
  some,
} from 'lodash';

import { ITEM_STATUS } from '@folio/stripes-acq-components';

export const unreceivePiece = (piece, mutator) => {
  const { id, poLineId } = piece;
  const item = {
    itemStatus: ITEM_STATUS.onOrder,
    pieceId: id,
  };
  const postData = {
    toBeReceived: [{
      poLineId,
      received: 1,
      receivedItems: [item],
    }],
    totalRecords: 1,
  };

  return mutator.POST(postData).then(({ receivingResults }) => {
    if (some(receivingResults, ({ processedWithError }) => processedWithError > 0)) {
      return Promise.reject(receivingResults);
    }

    return receivingResults;
  });
};
