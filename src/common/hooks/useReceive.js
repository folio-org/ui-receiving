import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { ITEM_STATUS } from '@folio/stripes-acq-components';

import { CHECKIN_API } from '../constants';

export const useReceive = (options = {}) => {
  const {
    mutationKey,
    signal,
    tenantId,
    ...mutationOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });

  const {
    isLoading,
    mutateAsync,
  } = useMutation({
    mutationKey: ['receive', tenantId, mutationKey],
    mutationFn: ({ pieces, deleteHoldings }) => {
      const selectedPieces = pieces
        .map((piece) => ({
          accessionNumber: piece.accessionNumber,
          barcode: piece.barcode,
          callNumber: piece.callNumber,
          chronology: piece.chronology,
          comment: piece.comment,
          copyNumber: piece.copyNumber,
          createItem: piece.isCreateItem,
          displayOnHolding: piece.displayOnHolding,
          displaySummary: piece.displaySummary,
          displayToPublic: piece.displayToPublic,
          enumeration: piece.enumeration,
          holdingId: piece.holdingId || null,
          id: piece.id,
          itemStatus: piece.itemStatus === ITEM_STATUS.undefined
            ? ITEM_STATUS.inProcess
            : piece.itemStatus,
          locationId: piece.locationId || null,
          receiptDate: piece.receiptDate,
          receivingTenantId: piece.receivingTenantId,
          sequenceNumber: piece.sequenceNumber,
          supplement: piece.supplement,
        }));

      const searchParams = { deleteHoldings };

      return ky.post(CHECKIN_API, {
        searchParams,
        signal,
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
    ...mutationOptions,
  });

  return {
    isLoading,
    receive: mutateAsync,
  };
};
