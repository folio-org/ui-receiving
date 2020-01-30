import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  find,
  get,
  some,
} from 'lodash';

import { ITEM_STATUS } from './constants';

export const checkInItems = (piece, mutator) => {
  const item = {
    id: piece.id,
    barcode: piece.barcode,
    callNumber: piece.callNumber,
    comment: piece.comment,
    caption: piece.caption,
    supplement: piece.supplement,
    locationId: piece.locationId || null,
    itemStatus: piece.itemStatus,
  };

  const postData = {
    toBeCheckedIn: [{
      poLineId: piece.poLineId,
      checkedIn: 1,
      checkInPieces: [item],
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

export const getPOLLocationsForSelect = (locations, poLineLocations = []) => (
  poLineLocations.map(({ locationId }) => {
    const location = find(locations, ['id', locationId]);

    return (
      location
        ? {
          label: `${location.name} (${location.code})`,
          value: location.id,
        }
        : ''
    );
  }).filter(Boolean)
);

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

export const getPieceStatusFromItem = (itemStatus) => {
  return itemStatus === ITEM_STATUS.onOrder
    ? ITEM_STATUS.inProcess
    : itemStatus;
};

export const getItemStatusLabel = (itemStatus) => {
  const status = itemStatus || ITEM_STATUS.undefined;

  return status === ITEM_STATUS.onOrder
    ? (
      <FormattedMessage
        id={`ui-receiving.piece.itemStatus.${ITEM_STATUS.inProcess}`}
        defaultMessage={status}
      />
    )
    : itemStatus;
};

export const getPiecesToReceive = (expectedPieces = [], items = [], requests = []) => (
  expectedPieces.map(piece => {
    const item = find(items, ['id', piece.itemId]);
    const request = find(requests, ['id', piece.itemId]);

    return ({
      ...piece,
      barcode: get(item, 'barcode', ''),
      callNumber: get(item, 'itemLevelCallNumber', ''),
      itemStatus: getPieceStatusFromItem(get(item, 'status.name', ITEM_STATUS.undefined)),
      request,
    });
  })
);
