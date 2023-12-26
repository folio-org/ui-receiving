import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';
import {
  LIMIT_MAX,
  USERS_API,
  batchRequest,
} from '@folio/stripes-acq-components';

import { PIECE_AUDIT_API } from '../../../common/constants';

const DEFAULT_DATA = [];

export const usePieceStatusChangeLog = (pieceId, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const { enabled = true, ...queryOptions } = options;
  const searchParams = {
    limit: LIMIT_MAX,
  };

  const {
    data = DEFAULT_DATA,
    isLoading,
    isFetching,
  } = useQuery(
    [namespace, pieceId],
    async () => {
      const { pieceAuditEvents } = await ky.get(`${PIECE_AUDIT_API}/${pieceId}/status-change-history`, { searchParams }).json();

      const userIds = [...pieceAuditEvents.reduce((acc, { userId }) => acc.add(userId), new Set())];
      const users = await batchRequest(
        ({ params }) => ky.get(USERS_API, { searchParams: params }).json(),
        userIds,
      ).then(responses => responses.flatMap((response) => response.users));
      const usersMap = keyBy(users, 'id');

      return pieceAuditEvents.map(({ eventDate, userId, pieceSnapshot }) => ({
        eventDate,
        user: usersMap[userId],
        ...get(pieceSnapshot, 'map', {}),
      }));
    },
    {
      enabled: enabled && Boolean(pieceId),
      ...queryOptions,
    },
  );

  return {
    data,
    isFetching,
    isLoading,
  };
};
