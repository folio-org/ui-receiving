import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  title: faker.finance.accountName,
  poLineId: faker.random.uuid,
  instanceId: faker.random.uuid,
  contributors: () => [
    {
      contributor: 'Ed Mashburn',
      contributorNameTypeId: 'fbdd42a8-e47d-4694-b448-cc571d1b44c3',
    },
  ],
  publisher: () => 'Schiffer Publishing',
  publishedDate: () => '1972',
  edition: () => 'Third Edt.',
  subscriptionFrom: () => '2018-10-09T00:00:00.000Z',
  subscriptionInterval: () => 824,
  subscriptionTo: () => '2020-10-09T00:00:00.000Z',
  isAcknowledged: () => false,
  productIds: () => [
    {
      'productId': '9780764354113',
      'productIdType': '8261054f-be78-422d-bd51-4ed9f33c3422',
      'qualifier': '(paperback)',
    },
  ],
});
