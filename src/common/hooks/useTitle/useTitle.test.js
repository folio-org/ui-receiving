import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { TITLES_API } from '../../constants';
import { useTitle } from './useTitle';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const title = {
  id: 'title-id',
};

describe('useTitle', () => {
  const getMock = jest.fn(() => ({
    json: () => Promise.resolve(title),
  }));

  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({ get: getMock });
  });

  it('should fetch title by id', async () => {
    const { result } = renderHook(() => useTitle(title.id), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.title).toEqual(title);
    expect(getMock).toHaveBeenCalledWith(`${TITLES_API}/${title.id}`, expect.objectContaining({}));
  });
});
