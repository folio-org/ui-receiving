import { ITEMS_API } from '@folio/stripes-acq-components';

export const getItemById = (ky) => (itemId) => {
  return ky.get(`${ITEMS_API}/${itemId}`).json();
};
