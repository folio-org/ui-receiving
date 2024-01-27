import {
  flatten,
  flow,
  map,
  partition,
} from 'lodash/fp';

import {
  formatDate,
  getHoldingLocationName,
} from '@folio/stripes-acq-components';

export const createExportReport = (
  {
    contributorNameTypesMap,
    holdingsMap,
    identifierTypesMap,
    itemsMap,
    locationsMap,
    pieces,
    poLinesMap,
    purchaseOrdersMap,
    titles,
    vendorsMap,
  },
  {
    intl,
  },
) => {
  const invalidReferenceLabel = intl.formatMessage({ id: 'ui-receiving.titles.invalidReference' });

  const getContributors = (contributors) => {
    return contributors.map(({ contributor, contributorNameTypeId }) => (
      `"${contributor}""${contributorNameTypesMap[contributorNameTypeId]?.name ?? invalidReferenceLabel}"`
    )).join(' | ');
  };

  const getProductIds = (productIds) => {
    return productIds.map(({ productId, productIdType, qualifier }) => {
      const productTypeName = identifierTypesMap[productIdType]?.name ?? invalidReferenceLabel;

      return `"${productId}""${qualifier || ''}""${productTypeName}"`;
    }).join(' | ');
  };

  const getPieceLocation = ({
    holdingId,
    locationId,
  }) => (
    holdingId
      ? holdingsMap[holdingId] && getHoldingLocationName(holdingsMap[holdingId], locationsMap)
      : locationsMap[locationId]?.name && `${locationsMap[locationId].name} (${locationsMap[locationId]?.code})`
  );

  const getTitleFields = (titleData) => {
    const poLine = poLinesMap[titleData.poLineId];
    const order = purchaseOrdersMap[poLine?.purchaseOrderId];

    return {
      title: titleData.title,
      publisher: titleData.publisher,
      publishedDate: titleData.publishedDate,
      edition: titleData.edition,
      subscriptionFrom: formatDate(titleData.subscriptionFrom, intl),
      subscriptionTo: formatDate(titleData.subscriptionTo, intl),
      contributors: getContributors(titleData.contributors),
      productIds: getProductIds(titleData.productIds),
      orderType: order?.orderType,
      vendor: vendorsMap[order?.vendor]?.name,
      requester: poLine?.requester,
      rush: poLine?.rush,
    };
  };

  const getPieceFields = (pieceData = {}) => {
    const item = itemsMap[pieceData.itemId];

    return {
      displaySummary: pieceData.displaySummary,
      copyNumber: pieceData.copyNumber,
      enumeration: pieceData.enumeration,
      chronology: pieceData.chronology,
      barcode: item?.barcode,
      callNumber: item?.itemLevelCallNumber,
      format: pieceData.format,
      receiptDate: formatDate(pieceData.receiptDate, intl),
      comment: pieceData.comment,
      location: pieceData.id && getPieceLocation(pieceData),
      supplement: Boolean(pieceData.supplement),
      displayOnHolding: pieceData.displayOnHolding,
      itemHRID: item?.hrid,
      receivingStatus: pieceData.receivingStatus,
      internalNote: pieceData.internalNote,
      externalNote: pieceData.externalNote,
    };
  };

  const getExportRow = ({
    title,
    piece,
  }) => ({
    ...getTitleFields(title),
    ...getPieceFields(piece),
  });

  let remainPieces = pieces;

  const buildExportRows = (title) => {
    const [titlePieces, otherPieces] = partition(({ titleId }) => titleId === title.id)(remainPieces);

    remainPieces = otherPieces;

    return titlePieces.length
      ? titlePieces.map((piece) => getExportRow({ title, piece }))
      : [getExportRow({ title })];
  };

  return flow(
    map(buildExportRows),
    flatten,
  )(titles);
};
