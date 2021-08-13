import { getKeywordQuery } from './ReceivingListSearchConfig';

test('getKeywordQuery', () => {
  const query = getKeywordQuery('query');

  expect(query).toBe('title=="*query*" or poLine.titleOrPackage=="*query*" or productIds=="*query*" or purchaseOrder.poNumber=="*query*" or poLine.poLineNumber=="*query*" or poLine.vendorDetail.referenceNumbers=="*query*"');
});
