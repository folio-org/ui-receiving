import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { ORDER_PIECES_API } from '@folio/stripes-acq-components';

import { getDehydratedPiece } from '../utils';

export const usePieceMutator = (mOptions = {}) => {
  const { tenantId, ...mutatorOptions } = mOptions;

  const ky = useOkapiKy({ tenant: tenantId });

  const { mutateAsync } = useMutation({
    mutationFn: ({ piece: pieceValues, options = {} }) => {
      const piece = getDehydratedPiece(pieceValues);

      const kyMethod = piece.id ? 'put' : 'post';
      const kyPath = piece.id ? `${ORDER_PIECES_API}/${piece.id}` : ORDER_PIECES_API;
      const kyOptions = {
        method: options?.method ?? kyMethod,
        json: piece,
        ...options,
        searchParams: {
          ...(pieceValues.isCreateItem ? { createItem: true } : {}),
          ...options?.searchParams,
        },
      };

      return ky(kyPath, kyOptions).then(response => (piece.id ? piece : response.json()));
    },
    ...mutatorOptions,
  });

  return {
    mutatePiece: mutateAsync,
  };
};
