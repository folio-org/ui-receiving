import { CQLBuilder } from '@folio/stripes-acq-components';

import { getKeywordQuery } from './ReceivingListSearchConfig';

const { EQUAL, FUZZY } = CQLBuilder.OPERATORS;

test('getKeywordQuery', () => {
  const query = getKeywordQuery('query');

  expect(query).toBe(
    [
      `title${FUZZY}"query"`,
      `poLine.titleOrPackage${FUZZY}"query"`,
      `productIds${FUZZY}"query"`,
      `purchaseOrder.poNumber${EQUAL}"query"`,
      `poLine.poLineNumber${EQUAL}"query"`,
      `poLine.vendorDetail.referenceNumbers${FUZZY}"query"`,
    ].join(' or '),
  );
});
