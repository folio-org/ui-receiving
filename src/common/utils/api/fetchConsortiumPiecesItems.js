import { TENANT_ITEMS_API } from '../../constants';

/*
  Fetch items from consortium (multi tenants) for given pieces by providing their item IDs and tenant IDs.
  https://s3.amazonaws.com/foliodocs/api/mod-inventory/r/inventory.html#inventory_tenant_items_post
*/
export const fetchConsortiumPiecesItems = (httpClient) => (pieces, options = {}) => {
  const dto = {
    tenantItemPairs: pieces.filter(({ itemId }) => Boolean(itemId)).map(({ itemId, receivingTenantId }) => ({
      tenantId: receivingTenantId,
      itemId,
    })),
  };

  return httpClient
    .post(TENANT_ITEMS_API, { json: dto, ...options })
    .json()
    .then(({ tenantItems }) => tenantItems.map(({ item, tenantId }) => ({ tenantId, ...item })));
};
