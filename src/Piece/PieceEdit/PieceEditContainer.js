import { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { useShowCallout } from '@folio/stripes-acq-components';

import {
  usePiece,
  usePieceMutator,
  useUnreceive,
} from '../../common/hooks';
import {
  handleCommonErrors,
  handleUnrecieveErrorResponse,
} from '../../common/utils';
import { useReceivingSearchContext } from '../../contexts';
import { PieceFormContainer } from '../PieceForm';

// const getHoldingsItemsAndPieces = (holdingId, params = {}) => {
//   const holdingsPieces = mutator.pieces.GET({
//     params: {
//       limit: `${LIMIT_MAX}`,
//       query: `holdingId==${holdingId}`,
//       ...params,
//     },
//     records: undefined,
//   });

//   // TODO: fetch from related tenants in central ordering and for central tenant
//   const holdingsItems = mutator.items.GET({
//     params: {
//       limit: `${LIMIT_MAX}`,
//       query: `holdingsRecordId==${holdingId}`,
//       ...params,
//     },
//     records: undefined,
//   });

//   return Promise
//     .all([holdingsPieces, holdingsItems])
//     .then(([piecesInHolding, itemsInHolding]) => ({
//       pieces: piecesInHolding,
//       items: itemsInHolding,
//     }))
//     .catch(() => ({}));
// };

export const PieceEditContainer = ({ match }) => {
  const { pieceId } = match.params;

  const showCallout = useShowCallout();
  const { targetTenantId: tenantId } = useReceivingSearchContext();

  const {
    isLoading,
    piece,
  } = usePiece(pieceId, { tenantId });

  const { mutatePiece } = usePieceMutator({ tenantId });
  const { unreceive } = useUnreceive({ tenantId });

  const onPieceDelete = useCallback((pieceToDelete, options = {}) => {
    const apiCall = pieceToDelete?.id
      ? mutatePiece({
        piece: pieceToDelete,
        options: {
          ...options,
          method: 'delete',
        },
      })
      : Promise.resolve();

    return apiCall.then(
      () => {
        showCallout({
          messageId: 'ui-receiving.piece.actions.delete.success',
          type: 'success',
          values: { enumeration: pieceToDelete?.enumeration },
        });
      },
      async (response) => {
        const hasCommonErrors = await handleCommonErrors(showCallout, response);

        if (!hasCommonErrors) {
          showCallout({
            messageId: 'ui-receiving.piece.actions.delete.error',
            type: 'error',
            values: { enumeration: pieceToDelete?.enumeration },
          });
        }
      },
    );
  }, [showCallout, mutatePiece]);

  const onUnreceive = useCallback((pieces) => {
    return unreceive(pieces)
      .then(async () => {
        showCallout({
          messageId: 'ui-receiving.title.actions.unreceive.success',
          type: 'success',
        });
      })
      .catch(async (error) => handleUnrecieveErrorResponse({ error, showCallout, receivedItems: pieces }));
  }, [showCallout, unreceive]);

  return (
    <PieceFormContainer
      initialValues={piece}
      isLoading={isLoading}
    />
  );
};

PieceEditContainer.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};
