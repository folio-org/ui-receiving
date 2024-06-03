import keyBy from 'lodash/keyBy';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  ITEMS_API,
  LIMIT_MAX,
  LINES_API,
  ORDER_PIECES_API,
  PIECE_STATUS,
  batchRequest,
} from '@folio/stripes-acq-components';

import { getPieceStatusFromItem } from '../../../common/utils';

const DEFAULT_DATA = [];

export const useUnboundPieces = (titleId, poLineId, options = {}) => {
  const { enabled = true, ...otherOptions } = options;
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'unbound-pieces' });
  const filterQuery = `titleId=${titleId} and poLineId==${poLineId} and receivingStatus==${PIECE_STATUS.received} and isBound==false`;

  const searchParams = {
    limit: LIMIT_MAX,
    query: `${filterQuery} sortby locationId`,
  };

  const {
    data = DEFAULT_DATA,
    isLoading,
  } = useQuery(
    [namespace, titleId],
    async () => {
      const { pieces = [] } = await ky.get(ORDER_PIECES_API, { searchParams }).json();
      const poLine = await ky.get(`${LINES_API}/${poLineId}`).json();
      const isBinderyActive = poLine?.details?.isBinderyActive;

      if (!isBinderyActive || !pieces.length) {
        return DEFAULT_DATA;
      }

      const itemIds = pieces.map(({ itemId }) => itemId).filter(Boolean);

      const pieceItems = await batchRequest(
        ({ params }) => ky.get(ITEMS_API, { searchParams: params }).json(),
        itemIds,
      ).then(responses => responses.flatMap(({ items }) => items));

      const itemsMap = keyBy(pieceItems, 'id');

      return pieces.map((piece) => ({
        ...piece,
        yearCaption: piece.itemId ? itemsMap[piece.itemId].yearCaption : undefined,
        itemStatus: piece.itemId ? getPieceStatusFromItem(itemsMap[piece.itemId]) : undefined,
      }));
    },
    {
      enabled: Boolean(enabled && titleId && poLineId),
      ...otherOptions,
    },
  );

  return ({
    isLoading,
    unboundPieces: data,
  });
};
