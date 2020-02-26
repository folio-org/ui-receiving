import {
  find,
  get,
  some,
} from 'lodash';

import { ITEM_STATUS } from '@folio/stripes-acq-components';

import { getPieceStatusFromItem } from '../common/utils';

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

export const getPiecesToReceive = (expectedPieces = [], items = [], requests = []) => {

  return expectedPieces.map(piece => {
    const item = find(items, ['id', piece.itemId]);
    const request = find(requests, ['id', piece.itemId]);

    return ({
      ...piece,
      barcode: get(item, 'barcode', ''),
      callNumber: get(item, 'itemLevelCallNumber', ''),
      itemStatus: getPieceStatusFromItem(item),
      request,
    });
  });
};
