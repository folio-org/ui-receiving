import { useIntl } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import { usePiece } from '../../common/hooks';
import { useReceivingSearchContext } from '../../contexts';
import { PieceFormContainer } from '../PieceForm';

export const PieceEdit = ({ match }) => {
  const { pieceId } = match.params;

  const intl = useIntl();

  const { targetTenantId: tenantId } = useReceivingSearchContext();

  const {
    isLoading,
    piece,
  } = usePiece(pieceId, { tenantId });

  return (
    <PieceFormContainer
      initialValues={piece}
      isLoading={isLoading}
      paneTitle={intl.formatMessage({ id: 'ui-receiving.piece.addPieceModal.editTitle' })}
    />
  );
};

PieceEdit.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};
