import { useMutation } from 'react-query';

export const useExpectPieces = () => {
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: (pieces) => {
      console.log('pieces to expect', pieces);

      return Promise.reject(new Error('Not implemented yet'));
    },
  });

  return {
    expectPieces: mutateAsync,
    isLoading,
  };
};
