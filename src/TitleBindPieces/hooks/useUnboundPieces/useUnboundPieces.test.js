import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  LINES_API,
  ORDER_PIECES_API,
} from '@folio/stripes-acq-components';
import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useUnboundPieces } from './useUnboundPieces';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const titleId = 'title-id';
const piece = {
  barcode: 'Br123',
  displaySummary: 'Tests',
  format: 'Physical',
  id: '567fec24-b02c-4a09-afb2-2995c16af11d',
  isBound: false,
  itemId: 'item-id',
};

const poLine = {
  id: 'poLine-id',
  details: {
    isBinderyActive: false,
  },
};

const item = {
  id: 'item-id',
  yearCaption: '2024',
};

describe('useUnboundPieces', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({ get: jest.fn((url) => {
        return ({
          json: () => {
            if (url === ORDER_PIECES_API) {
              return Promise.resolve({ pieces: [piece] });
            }

            if (url.includes(LINES_API)) {
              return Promise.resolve(poLine);
            }

            return Promise.resolve({ items: [item] });
          },
        });
      }) });
  });

  it.each`
  isBinderyActive
  ${false}
  ${true}
  `('should handle unboundPieces when POL isBinderyActive = `$isBinderyActive`', async ({ isBinderyActive }) => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({ get: jest.fn((url) => {
        return ({
          json: () => {
            if (url === ORDER_PIECES_API) {
              return Promise.resolve({ pieces: [piece] });
            }

            if (url.includes(LINES_API)) {
              return Promise.resolve({
                id: 'poLine-id',
                details: {
                  isBinderyActive,
                },
              });
            }

            return Promise.resolve({ items: [item] });
          },
        });
      }) });

    const { result } = renderHook(() => useUnboundPieces(titleId, poLine.id), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    await waitFor(() => expect(result.current.unboundPieces).toHaveLength(isBinderyActive ? 1 : 0));
  });
});
