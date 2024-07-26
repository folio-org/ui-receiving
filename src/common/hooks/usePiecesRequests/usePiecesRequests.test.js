import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { usePiecesRequests } from './usePiecesRequests';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const pieces = [
  { id: '1', itemId: 'foo' },
  { id: '2', itemId: 'bar' },
];

const circulationRequests = [
  { id: '1' },
  { id: '2' },
];

describe('usePiecesRequests', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({ circulationRequests }),
  }));

  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: mockGet,
      });
  });

  it('should fetch pieces requests', async () => {
    const { result } = renderHook(() => usePiecesRequests(pieces), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.requests).toEqual(circulationRequests);
  });
});
