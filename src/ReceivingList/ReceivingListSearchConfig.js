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
  [INDEXES.PO_LINE_NUMBER]: buildEqualQuery,
  [INDEXES.PO_NUMBER]: buildEqualQuery,
};

export const formatSearchCql = (sIndex, sQuery) => {
  const formatCqlFn = formatSearchCqlMap[sIndex];

  return formatCqlFn
    ? formatCqlFn(sIndex, sQuery)
    : new CQLBuilder().fuzzy(sIndex, sQuery).build();
};

export const getKeywordQuery = (query) => INDEXES_VALUES.reduce(
  (acc, sIndex) => {
    const formattedQuery = formatSearchCql(sIndex, query);

    return acc ? `${acc} or ${formattedQuery}` : formattedQuery;
  },
  '',
);
