import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { BIND_PIECES_API } from '../../../common/constants';
import { useBindPiecesMutation } from './useBindPiecesMutation';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
}));

const deleteMock = jest.fn();
const putMock = jest.fn();
const postMock = jest.fn();

const mockRequestData = {
  'poLineId': '3f4f61ab-d3c2-47a9-baa6-c903a4cfba57',
  'bindItem': {
    'barcode': '0987654111',
    'materialTypeId': 'a058cb27-a77d-4cb3-b76b-2adc931fb0c9',
    'callNumber': 'BF2050 .M335 2000',
    'permanentLoanTypeId': '41673a86-ebab-4a5a-8b1b-76110a6f86f4',
    'permanentLocationId': '02cc63e9-dda0-4b49-bbc6-6253edffcc67',
    'tenantId': 'diku',
  },
  'bindPieceIds': [
    'fe729e0b-5c56-4f0a-bb3a-33bc405d71a0',
    '4d6b8cf9-73bd-4b3d-8f1b-5b7cbf02d03a',
  ],
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useRoutingListMutation', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        delete: deleteMock,
        put: putMock,
        post: postMock,
      });
  });

  it('should call `bindPieces` mutation', async () => {
    const { result, waitFor } = renderHook(() => useBindPiecesMutation(), { wrapper });

    await result.current.bindPieces(mockRequestData);
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(postMock).toHaveBeenCalledWith(BIND_PIECES_API, expect.objectContaining({}));
  });
});
