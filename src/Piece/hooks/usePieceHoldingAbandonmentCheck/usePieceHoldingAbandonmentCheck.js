import get from 'lodash/get';
import { useCallback } from 'react';

import { useOkapiKy } from '@folio/stripes/core';
import { HOLDINGS_API } from '@folio/stripes-acq-components';

import {
  extendKyWithTenant,
  getHoldingsItemsAndPieces,
} from '../../../common/utils';
import { useReceivingSearchContext } from '../../../contexts';

const mergeResults = (results = []) => {
  return Promise.all(results)
    .then((resolved) => {
      return resolved.reduce((acc, curr) => {
        acc.items.items.push(...get(curr, 'items.items', []));
        acc.pieces.pieces.push(...get(curr, 'pieces.pieces', []));
        acc.items.totalRecords += get(curr, 'items.totalRecords', 0);
        acc.pieces.totalRecords += get(curr, 'pieces.totalRecords', 0);

        return acc;
      }, {
        items: {
          items: [],
          totalRecords: 0,
        },
        pieces: {
          pieces: [],
          totalRecords: 0,
        },
      });
    });
};

export const usePieceHoldingAbandonmentCheck = (initialValues = {}) => {
  const {
    itemId,
    receivingTenantId,
  } = initialValues;

  const {
    targetTenantId,
    crossTenant,
  } = useReceivingSearchContext();

  const receivingTenantKy = receivingTenantId ?? targetTenantId;
  const ky = useOkapiKy({ tenant: receivingTenantKy });

  const checkHoldingAbandonment = useCallback((holdingId) => {
    return ky.get(`${HOLDINGS_API}/${holdingId}`)
      .json()
      .then((holding) => {
        return crossTenant && (targetTenantId !== receivingTenantId)
          /*
            In the central ordering, pieces from both a parent tenant of the holding
            and the central tenant can relate to the holding located in the member tenant.
          */
          ? mergeResults([
            getHoldingsItemsAndPieces(extendKyWithTenant(ky, targetTenantId))(holding.id, { limit: 1 }),
            getHoldingsItemsAndPieces(ky)(holding.id, { limit: 1 }),
          ])
          : getHoldingsItemsAndPieces(ky)(holding.id, { limit: 1 });
      })
      .then(({ pieces, items }) => {
        const willAbandoned = Boolean(
          pieces && items
          && (pieces.totalRecords === 1)
          && ((items.totalRecords === 1 && itemId) || items.totalRecords === 0),
        );

        return { willAbandoned };
      })
      .catch(() => ({ willAbandoned: false }));
  }, [crossTenant, itemId, ky, receivingTenantId, targetTenantId]);

  return { checkHoldingAbandonment };
};
