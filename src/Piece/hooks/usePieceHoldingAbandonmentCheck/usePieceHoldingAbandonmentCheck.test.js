import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useHoldingsAbandonmentAnalyzer } from '@folio/stripes-acq-components';

import {
  holdings,
  pieces,
} from 'fixtures';
import { usePieceHoldingAbandonmentCheck } from './usePieceHoldingAbandonmentCheck';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useHoldingsAbandonmentAnalyzer: jest.fn(),
}));

const analyze = jest.fn(() => Promise.resolve([{ abandoned: false }]));
const analyzerFactory = jest.fn(() => Promise.resolve({ analyze }));

describe('usePieceHoldingAbandonmentCheck', () => {
  beforeEach(() => {
    useHoldingsAbandonmentAnalyzer.mockReturnValue({ analyzerFactory });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an object indicating the absence of abandonment of the holding', async () => {
    const { result } = renderHook(() => usePieceHoldingAbandonmentCheck());

    const { willAbandoned } = await result.current.checkHoldingAbandonment(pieces[0].id, holdings[0].id);

    expect(willAbandoned).toBeFalsy();
  });

  describe('should return an object indicating the abandonment of the holding', () => {
    it('when there is only one piece associated with the holding', async () => {
      analyze.mockResolvedValue([{ abandoned: true }]);

      const { result } = renderHook(() => usePieceHoldingAbandonmentCheck());

      const { willAbandoned } = await result.current.checkHoldingAbandonment(pieces[0].id, holdings[0].id);

      expect(willAbandoned).toBeTruthy();
    });

    it('when there is only one item associated with the piece and the holding', async () => {
      analyze.mockResolvedValue([{ abandoned: true }]);

      const { result } = renderHook(() => usePieceHoldingAbandonmentCheck());

      const { willAbandoned } = await result.current.checkHoldingAbandonment(pieces[0].id, holdings[0].id);

      expect(willAbandoned).toBeTruthy();
    });

    describe('ECS mode', () => {
      it('when there is only one item only in the member tenant associated with the piece and the holding', async () => {
        analyze.mockResolvedValue([{ abandoned: true }]);

        const { result } = renderHook(() => usePieceHoldingAbandonmentCheck());

        const { willAbandoned } = await result.current.checkHoldingAbandonment(pieces[0].id, holdings[0].id);

        expect(willAbandoned).toBeTruthy();
      });
    });
  });
});
