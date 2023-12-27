import { useMutation } from 'react-query';

export const usePiecesExpect = () => {
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: (_pieces) => {
      return Promise.reject(new Error('TODO: UIREC-307'));
    },
  });

  return {
    expectPieces: mutateAsync,
    isLoading,
  };
};
