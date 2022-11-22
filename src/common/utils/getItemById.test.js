import {
  ITEM_STATUS,
  ITEMS_API,
} from '@folio/stripes-acq-components';

import { getItemById } from './getItemById';

const itemId = 'itemId';
const item = {
  id: itemId,
  status: {
    name: ITEM_STATUS.onOrder,
  },
};
const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve(item),
  })),
};

test('getItemById should call items API and return an item by UUID', async () => {
  expect(await getItemById(kyMock)(itemId)).toEqual(item);
  expect(kyMock.get).toHaveBeenCalledWith(`${ITEMS_API}/${itemId}`);
});
