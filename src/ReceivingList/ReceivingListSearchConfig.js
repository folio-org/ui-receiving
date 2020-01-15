const indexes = [
  'title',
  'poLine.titleOrPackage',
  'productIds',
  'purchaseOrder.poNumber',
  'poLine.poLineNumber',
  'barcode',
];

export const searchableIndexes = [
  {
    labelId: 'ui-receiving.search.keyword',
    value: '',
  },
  ...indexes.map(index => ({ labelId: `ui-receiving.search.${index}`, value: index })),
];

export const getKeywordQuery = query => indexes.reduce(
  (acc, sIndex, idx) => {
    if (acc) {
      return `${acc} or ${sIndex}="${query}*"`;
    } else {
      return `${sIndex}="${query}*"`;
    }
  },
  '',
);
