import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useItemsList } from './useItemsList';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const params = {
  titleId: 'titleId',
  poLineId: 'poLineId',
};

const items = [{
  isBound: true,
  displaySummary: 'Electronic item',
  status: { name: 'Available' },
  itemId: 'itemId',
  id: 'id',
}];

describe('useItemsList', () => {
  const getMock = jest.fn((url) => ({
    json: () => {
      if (url.includes('pieces')) {
        return { pieces: [{ itemId: 'itemId' }] };
      }

      return { items };
    },
  }));

  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({ get: getMock });
  });

  it('should fetch items by id', async () => {
    const { result } = renderHook(() => useItemsList(params), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.items).toEqual(items);
    expect(getMock).toHaveBeenCalled();
  });
});
