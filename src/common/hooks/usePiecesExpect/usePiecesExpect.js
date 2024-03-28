import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { EXPECT_API } from '../../constants';

export const usePiecesExpect = () => {
  const ky = useOkapiKy();

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: (pieces) => {
      const selectedPieces = pieces
        .filter(({ checked }) => checked === true)
        .map(piece => ({
          id: piece.id,
          comment: piece.comment,
        }));

      const json = {
        toBeExpected: [{
          poLineId: pieces[0]?.poLineId,
          expected: selectedPieces.length,
          expectPieces: selectedPieces,
        }],
        totalRecords: selectedPieces.length,
      };

      return ky.post(EXPECT_API, { json })
        .json()
        .then(({ receivingResults }) => {
          if (receivingResults?.some(({ processedWithError }) => processedWithError > 0)) {
            return Promise.reject(receivingResults);
          }

          return receivingResults;
        });
    },
  });

  return {
    expectPieces: mutateAsync,
    isLoading,
  };
};
