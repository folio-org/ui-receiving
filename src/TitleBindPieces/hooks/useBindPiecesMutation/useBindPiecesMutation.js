import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { BIND_PIECES_API } from '../../../common/constants';

export const useBindPiecesMutation = () => {
  const ky = useOkapiKy();

  const createMutationFn = (value) => {
    return ky.post(BIND_PIECES_API, {
      json: value,
    });
  };

  const {
    isLoading: isBinding,
    mutateAsync: bindPieces,
  } = useMutation({ mutationFn: createMutationFn });

  return {
    bindPieces,
    isBinding,
  };
};
