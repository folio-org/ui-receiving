import { Factory } from 'miragejs';
import faker from 'faker';

import { ITEM_STATUS } from '../../../../src/TitleDetails/constants';

export default Factory.extend({
  id: faker.random.uuid,
  barcode: faker.random.numeric,
  status: () => ({
    name: ITEM_STATUS.onOrder,
  }),
});
