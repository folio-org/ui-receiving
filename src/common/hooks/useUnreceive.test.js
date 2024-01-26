import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useUnreceive } from './useUnreceive';

const queryClient = new QueryClient();
const pieceValues = {
  id: 'pieceId',
  holdingId: 'holdingId',
  caption: 'v1',
};

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useUnreceive', () => {
  it('should make post request to unreceive pieces', async () => {
    const postMock = jest.fn().mockReturnValue(Promise.resolve({ json: () => ({ receivingResults: [] }) }));

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
    });

    const { result } = renderHook(
      () => useUnreceive(),
      { wrapper },
    );

    await result.current.unreceive([pieceValues]);

    expect(postMock).toHaveBeenCalled();
  });
});
