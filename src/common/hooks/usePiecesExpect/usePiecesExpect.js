import { useMutation } from 'react-query';

export const usePiecesExpect = () => {
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: (_pieces) => {
      return Promise.reject(new Error('TODO: Not implemented yet'));
    },
  });

  return {
    expectPieces: mutateAsync,
    isLoading,
  };
};
