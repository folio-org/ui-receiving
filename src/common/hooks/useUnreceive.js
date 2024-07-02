import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { RECEIVE_API } from '../constants';
import { unreceivePieces } from '../utils';

export const useUnreceive = (options = {}) => {
  const { tenantId, ...mutationOptions } = options;

  const ky = useOkapiKy({ tenant: tenantId });

  const mutator = {
    POST: (pieces) => ky.post(RECEIVE_API, { json: pieces })
      .then(response => response.json()),
  };

  const { mutateAsync } = useMutation({
    mutationFn: (pieces) => unreceivePieces(pieces, mutator),
    ...mutationOptions,
  });

  return {
    unreceive: mutateAsync,
  };
};
