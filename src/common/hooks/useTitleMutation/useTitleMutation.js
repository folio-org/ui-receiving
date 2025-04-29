import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { TITLES_API } from '../../constants';

export const useTitleMutation = (options = {}) => {
  const { tenantId } = options;

  const ky = useOkapiKy({ tenant: tenantId });

  const deleteTitleMutationFn = ({ id, searchParams = {} }) => {
    return ky.delete(`${TITLES_API}/${id}`, { searchParams });
  };

  const { mutateAsync: deleteTitle, isLoading } = useMutation({ mutationFn: deleteTitleMutationFn });

  return {
    deleteTitle,
    isLoading,
  };
};
