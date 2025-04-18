import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { TITLES_API } from '../../constants';

export const useUnlinkTitleMutation = (options = {}) => {
  const { tenantId } = options;

  const ky = useOkapiKy({ tenant: tenantId });

  const unlinkTitleMutationFn = (values = {}) => {
    return ky.delete(`${TITLES_API}/${values.id}`, {
      json: values,
    });
  };

  const { mutateAsync: unlinkTitle, isLoading: isUnlinking } = useMutation({ mutationFn: unlinkTitleMutationFn });

  return {
    unlinkTitle,
    isUnlinking,
  };
};
