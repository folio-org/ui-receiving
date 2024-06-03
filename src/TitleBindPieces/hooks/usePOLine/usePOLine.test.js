import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { LINES_API } from '@folio/stripes-acq-components';
import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { usePOLine } from './usePOLine';

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
    const { result } = renderHook(() => usePOLine(title.id), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.poLine).toEqual(title);
    expect(getMock).toHaveBeenCalledWith(`${LINES_API}/${title.id}`, expect.objectContaining({}));
  });
});
