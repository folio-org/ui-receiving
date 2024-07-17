import {
  OKAPI_TENANT_HEADER,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';

export const getPieceById = (pieceMutator) => (id) => (
  pieceMutator.GET({
    path: `${ORDER_PIECES_API}/${id}`,
  })
    .catch(() => ({}))
);

export const extendKyWithTenant = (ky, tenantId) => {
  return ky.extend({
    hooks: {
      beforeRequest: [
        request => {
          request.headers.set(OKAPI_TENANT_HEADER, tenantId);
        },
      ],
    },
  });
};

export const isConsortiumEnabled = stripes => {
  return stripes?.hasInterface('consortia');
};
