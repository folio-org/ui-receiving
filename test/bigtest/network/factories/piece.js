import { Factory } from 'miragejs';
import faker from 'faker';

import { PIECE_STATUS } from '../../../../src/common/constants';

export default Factory.extend({
  id: () => faker.random.uuid(),
  poLineId: () => faker.random.uuid(),
  caption: (id) => `Piece - ${id}`,
  receivingStatus: () => PIECE_STATUS.expected,
  receiptDate: () => faker.date.future(),
});
