import { useCallback } from 'react';

import {
  HoldingsAbandonmentPieceStrategy,
  useHoldingsAbandonmentAnalyzer,
} from '@folio/stripes-acq-components';

export const usePieceHoldingAbandonmentCheck = () => {
  const { analyzerFactory } = useHoldingsAbandonmentAnalyzer();

  const checkHoldingAbandonment = useCallback(async (pieceId, holdingId, options = {}) => {
    const holdingIdsToCheck = [holdingId];
    const analyzer = await analyzerFactory({
      holdingIds: [holdingId],
      signal: options.signal,
    });

    const abandonmentAnalysisResult = await analyzer.analyze({
      explain: true,
      holdingIds: holdingIdsToCheck,
      ids: [pieceId],
      strategy: HoldingsAbandonmentPieceStrategy.name,
    });

    const willAbandoned = abandonmentAnalysisResult[0]?.abandoned;

    return { willAbandoned };
  }, [analyzerFactory]);

  return { checkHoldingAbandonment };
};
