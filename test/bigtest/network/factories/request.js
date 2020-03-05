import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  itemId: faker.random.uuid,
  item: {
    title: faker.finance.accountName,
  },
  status: () => 'Open',
});
