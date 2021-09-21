import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { ITEM_STATUS } from '@folio/stripes-acq-components';

import { CHECKIN_API } from '../constants';

export const useReceive = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: (pieces) => {
      const selectedPieces = pieces
        .map(piece => ({
          id: piece.id,
          barcode: piece.barcode,
          callNumber: piece.callNumber,
          comment: piece.comment,
          caption: piece.caption,
          copyNumber: piece.copyNumber,
          enumeration: piece.enumeration,
          supplement: piece.supplement,
          locationId: piece.locationId || null,
          holdingId: piece.holdingId || null,
          createItem: piece.isCreateItem,
          itemStatus: piece.itemStatus === ITEM_STATUS.undefined
            ? ITEM_STATUS.inProcess
            : piece.itemStatus,
        }));

      return ky.post(CHECKIN_API, {
        json: {
          toBeCheckedIn: [{
            poLineId: pieces[0]?.poLineId,
            checkedIn: selectedPieces.length,
            checkInPieces: selectedPieces,
          }],
          totalRecords: selectedPieces.length,
        },
      })
        .then(response => response.json())
        .then(({ receivingResults }) => {
          const errorPieces = receivingResults.filter(({ processedWithError }) => processedWithError > 0).reduce(
            (acc, { receivingItemResults }) => {
              const errorResults = receivingItemResults
                .filter(({ processingStatus }) => processingStatus.type === 'failure')
                .map((d) => ({
                  ...d,
                  enumeration: pieces.find(({ id }) => id === d.pieceId)?.enumeration,
                }));

              return [...acc, ...errorResults];
            },
            [],
          );

          if (errorPieces?.length > 0) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject({ response: { errorPieces } });
          }

          return receivingResults;
        });
    },
    ...options,
  });

  return {
    receive: mutateAsync,
  };
};
