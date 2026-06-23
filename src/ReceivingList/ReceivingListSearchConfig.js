import { CQLBuilder } from '@folio/stripes-acq-components';

const INDEXES = {
  TITLE: 'title',
  TITLE_OR_PACKAGE: 'poLine.titleOrPackage',
  PRODUCT_IDS: 'productIds',
  PO_NUMBER: 'purchaseOrder.poNumber',
  PO_LINE_NUMBER: 'poLine.poLineNumber',
  VENDOR_DETAIL_REFERENCE_NUMBERS: 'poLine.vendorDetail.referenceNumbers',
};

const INDEXES_VALUES = Object.values(INDEXES);

export const searchableIndexes = [
  {
    labelId: 'ui-receiving.search.keyword',
    value: '',
  },
  ...INDEXES_VALUES.map(index => ({ labelId: `ui-receiving.search.${index}`, value: index })),
];

const buildEqualQuery = (sIndex, sQuery) => new CQLBuilder().equal(sIndex, sQuery).build();

const formatSearchCqlMap = {
  [INDEXES.PO_LINE_NUMBER]: (sIndex, sQuery) => buildEqualQuery(sIndex, sQuery),
  [INDEXES.PO_NUMBER]: (sIndex, sQuery) => buildEqualQuery(sIndex, sQuery),
};

export const formatSearchCql = (sIndex, sQuery) => {
  const formatQueryFn = formatSearchCqlMap[sIndex];

  return formatQueryFn
    ? formatQueryFn(sIndex, sQuery)
    : new CQLBuilder().fuzzy(sIndex, sQuery).build();
};

export const getKeywordQuery = (query) => INDEXES_VALUES.reduce(
  (acc, sIndex) => {
    const formattedQuery = formatSearchCql(sIndex, query);

    if (acc) {
      return `${acc} or ${formattedQuery}`;
    } else {
      return formattedQuery;
    }
  },
  '',
);
