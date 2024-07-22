import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import {
  PIECE_STATUS,
  USERS_API,
} from '@folio/stripes-acq-components';

import { PIECE_AUDIT_API } from '../../../common/constants';
import { usePieceStatusChangeLog } from './usePieceStatusChangeLog';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const pieceId = 'piece-id';
const users = [
  {
    id: 'user-1',
    personal: {
      lastName: 'Galt',
      firstName: 'John',
    },
  },
];
const pieceAuditEvents = [
  {
    id: 'log-2',
    eventDate: '2023-12-26T14:08:19.402Z',
    userId: users[0].id,
    pieceSnapshot: {
      map: {
        receivingStatus: PIECE_STATUS.received,
      },
    },
  },
  {
    id: 'log-1',
    eventDate: '2023-12-25T14:08:18.402Z',
    userId: users[0].id,
    pieceSnapshot: {
      map: {
        receivingStatus: PIECE_STATUS.expected,
      },
    },
  },
];

const responsesMap = {
  [`${PIECE_AUDIT_API}/${pieceId}/status-change-history`]: { pieceAuditEvents },
  [USERS_API]: { users },
};

describe('usePieceStatusChangeLog', () => {
  const getMock = jest.fn((api) => ({
    json: () => Promise.resolve(responsesMap[api]),
  }));

  beforeEach(() => {
    getMock.mockClear();
    useOkapiKy
      .mockClear()
      .mockReturnValue({ get: getMock });
  });

  it('should return piece status change log', async () => {
    const { result } = renderHook(() => usePieceStatusChangeLog(pieceId), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.data).toHaveLength(pieceAuditEvents.length);
  });
});
