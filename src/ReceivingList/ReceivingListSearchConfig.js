const indexes = [
  'title',
  'poLine.titleOrPackage',
  'productIds',
  'purchaseOrder.poNumber',
  'poLine.poLineNumber',
  'poLine.vendorDetail.referenceNumbers',
];

export const searchableIndexes = [
  {
    labelId: 'ui-receiving.search.keyword',
    value: '',
  },
  ...indexes.map(index => ({ labelId: `ui-receiving.search.${index}`, value: index })),
];

export const getKeywordQuery = query => indexes.reduce(
  (acc, sIndex) => {
    if (acc) {
      return `${acc} or ${sIndex}=="*${query}*"`;
    } else {
      return `${sIndex}=="*${query}*"`;
    }
  },
  '',
);
