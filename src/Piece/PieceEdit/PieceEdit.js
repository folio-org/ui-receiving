import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  useItem,
  usePiece,
  usePiecesRequests,
} from '../../common/hooks';
import { getPieceStatusFromItem } from '../../common/utils';
import { useReceivingSearchContext } from '../../contexts';
import { PieceFormContainer } from '../PieceForm';

export const PieceEdit = ({ match }) => {
  const { pieceId } = match.params;

  const intl = useIntl();

  const { targetTenantId: tenantId } = useReceivingSearchContext();

  const {
    isLoading: isPieceLoading,
    piece,
  } = usePiece(pieceId, { tenantId });

  const {
    isLoading: isItemLoading,
    item,
  } = useItem(piece?.itemId, { tenantId });

  const {
    isLoading: isRequestsLoading,
    requests,
  } = usePiecesRequests([piece?.id], { tenantId });

  const initialValues = useMemo(() => ({
    ...(piece || {}),
    callNumber: item?.itemLevelCallNumber,
    itemStatus: getPieceStatusFromItem(item),
    request: requests?.[0],
    holdingsRecordId: piece?.holdingId,
  }), [item, piece, requests]);

  const isLoading = isPieceLoading || isItemLoading || isRequestsLoading;

  return (
    <PieceFormContainer
      initialValues={initialValues}
      isLoading={isLoading}
      paneTitle={intl.formatMessage({ id: 'ui-receiving.piece.pieceForm.edit.title' })}
    />
  );
};

PieceEdit.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};
