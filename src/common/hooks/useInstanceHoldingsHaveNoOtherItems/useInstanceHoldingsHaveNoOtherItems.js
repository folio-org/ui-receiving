import { useCallback, useEffect, useState } from 'react';

import { useOkapiKy } from '@folio/stripes/core';
import { useInstanceHoldingsQuery } from '@folio/stripes-acq-components';

import { getHoldingsItemsAndPieces } from '../../utils';

export const useInstanceHoldingsHaveNoOtherItems = ({ tenantId, instanceId, isCentralRouting }) => {
  const ky = useOkapiKy({ tenant: tenantId });
  const [allHoldingsHaveNoItemsOrPieces, setAllHoldingsHaveNoItemsOrPieces] = useState(false);
  const { holdings } = useInstanceHoldingsQuery(instanceId, { consortium: isCentralRouting });

  const checkHoldings = useCallback(async () => {
    if (!holdings || holdings.length === 0) return;

    const getItemsAndPieces = getHoldingsItemsAndPieces(ky);
    const results = await Promise.all(
      holdings.map(holding => getItemsAndPieces(holding.id)),
    );
    const allHoldingsHaveNoItemsOrPiecesResult = results.some(({ items, pieces }) => {
      return items.totalRecords <= 1 && pieces.totalRecords <= 1;
    });

    setAllHoldingsHaveNoItemsOrPieces(allHoldingsHaveNoItemsOrPiecesResult);
  }, [holdings, ky]);

  useEffect(() => {
    checkHoldings();
  }, [checkHoldings]);

  return allHoldingsHaveNoItemsOrPieces;
};
