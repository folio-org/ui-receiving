import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { ORDER_PIECES_API } from '@folio/stripes-acq-components';

export const usePieceMutation = (mutationOptions = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
    mutationFn: ({ piece, options = {} }) => {
      const kyMethod = piece.id ? 'put' : 'post';
      const kyPath = piece.id ? `${ORDER_PIECES_API}/${piece.id}` : ORDER_PIECES_API;
      const kyOptions = {
        method: options?.method ?? kyMethod,
        json: piece,
        ...options,
      };

      return ky(kyPath, kyOptions);
    },
    ...mutationOptions,
  });

  return {
    mutatePiece: mutateAsync,
  };
};
