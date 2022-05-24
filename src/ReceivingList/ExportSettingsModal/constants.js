export const EXPORT_TITLE_FIELDS = {
  title: 'Title',
  publisher: 'Publisher',
  publishedDate: 'Published date',
  edition: 'Edition',
  subscriptionFrom: 'Subscription from',
  subscriptionTo: 'Subscription to',
  contributors: 'Contributors',
  productIds: 'Product IDs',
  orderType: 'Order type',
  vendor: 'Vendor',
  requester: 'Requester',
  rush: 'Rush',
};

export const EXPORT_PIECE_FIELDS = {
  caption: 'Caption',
  copyNumber: 'Copy number',
  enumeration: 'Enumeration',
  chronology: 'Chronology',
  barcode: 'Barcode',
  callNumber: 'Call number',
  format: 'Piece format',
  receiptDate: 'Expected receipt date',
  comment: 'Comment',
  location: 'Location',
  supplement: 'Supplement',
  displayOnHolding: 'Display on holding',
  itemHRID: 'Item HRID',
};

export const EXPORT_SETTINGS_FIELDS = {
  exportPieceFields: 'exportPieceFields',
  exportTitleFields: 'exportTitleFields',
  pieceFields: 'pieceFields',
  titleFields: 'titleFields',
};

export const EXPORT_FIELDS_PARAMS = {
  all: 'all',
  selected: 'selected',
};

export const EXPORT_TITLE_FIELDS_OPTIONS = Object.keys(EXPORT_TITLE_FIELDS).map(field => ({
  label: EXPORT_TITLE_FIELDS[field],
  value: field,
}));

export const EXPORT_PIECE_FIELDS_OPTIONS = Object.keys(EXPORT_PIECE_FIELDS).map(field => ({
  label: EXPORT_PIECE_FIELDS[field],
  value: field,
}));

// Resource must be fetched if the value contains export fields
export const FETCH_CONFIGS_MAP = {
  contributorNameTypes: ['contributors'],
  holdings: ['location'],
  locations: ['location'],
  identifierTypes: ['productIds'],
  items: ['barcode', 'callNumber', 'itemHRID'],
  poLines: ['orderType', 'location', 'requester', 'rush', 'vendor'],
  purchaseOrders: ['orderType', 'vendor'],
  vendors: ['vendor'],
};
