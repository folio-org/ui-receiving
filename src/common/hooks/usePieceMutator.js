import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

import { getDehydratedPiece } from '../utils';

export const usePieceMutator = (options = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: (pieceValues) => {
      const piece = getDehydratedPiece(pieceValues);

      const kyMethod = piece.id ? 'put' : 'post';
      const kyPath = piece.id ? `${ORDER_PIECES_API}/${piece.id}` : ORDER_PIECES_API;

      return ky[kyMethod](kyPath, {
        json: piece,
        searchParams: pieceValues.isCreateItem ? { createItem: true } : undefined,
      }).then(response => (piece.id ? piece : response.json()));
    },
    ...options,
  });

  return {
    mutatePiece: mutateAsync,
  };
};
