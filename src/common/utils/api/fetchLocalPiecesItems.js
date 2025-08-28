import {
  batchRequest,
  ITEMS_API,
} from '@folio/stripes-acq-components';

/*
  Fetch items from local tenant for given pieces by providing their item IDs.
  https://s3.amazonaws.com/foliodocs/api/mod-inventory/r/inventory.html#inventory_items_get
*/
export const fetchLocalPiecesItems = (httpClient) => (pieces, options = {}) => {
  const itemIds = pieces.reduce((acc, { itemId }) => {
    return itemId ? acc.concat(itemId) : acc;
  }, []);

  return batchRequest(
    async ({ params: searchParams }) => {
      const { items = [] } = await httpClient.get(ITEMS_API, { searchParams, ...options }).json();

      return items;
    },
    itemIds,
  );
};
