import { some } from 'lodash';
import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { ITEM_STATUS } from '@folio/stripes-acq-components';

import { RECEIVE_API } from '../constants';

export const useUnreceive = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: (pieces) => {
      const selectedPieces = pieces
        .map(piece => ({
          caption: piece.caption,
          chronology: piece.chronology,
          comment: piece.comment,
          copyNumber: piece.copyNumber,
          displayOnHolding: piece.displayOnHolding,
          enumeration: piece.enumeration,
          pieceId: piece.id,
          itemStatus: ITEM_STATUS.onOrder,
        }));

      const postData = {
        toBeReceived: [{
          poLineId: pieces[0]?.poLineId,
          received: selectedPieces.length,
          receivedItems: selectedPieces,
        }],
        totalRecords: selectedPieces.length,
      };

      return ky.post(RECEIVE_API, { json: postData })
        .then(response => response.json())
        .then(({ receivingResults }) => {
          if (some(receivingResults, ({ processedWithError }) => processedWithError > 0)) {
            return Promise.reject(receivingResults);
          }

          return receivingResults;
        });
    },
    ...options,
  });

  return {
    unreceive: mutateAsync,
  };
};
