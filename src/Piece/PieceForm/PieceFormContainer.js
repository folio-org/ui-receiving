import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import {
  ConfirmationModal,
  LoadingView,
} from '@folio/stripes/components';
import {
  ORDER_STATUSES,
  useAcqRestrictions,
  useLocationsQuery,
  useOrderLine,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  useOrder,
  usePieceMutator,
  useQuickReceive,
  useTitle,
  useUnreceive,
} from '../../common/hooks';
import {
  CENTRAL_RECEIVING_ROUTE_VIEW,
  RECEIVING_ROUTE_VIEW,
} from '../../constants';
import { useReceivingSearchContext } from '../../contexts';
import { usePieceQuickReceiving } from '../hooks';
import { handleCommonErrors } from '../../common/utils';

export const PieceFormContainer = ({
  initialValues,
  isLoading: isLoadingProp = false,
}) => {
  const showCallout = useShowCallout();
  const intl = useIntl();
  const history = useHistory();
  const { search } = useLocation();
  const { id: titleId } = useParams();

  const {
    targetTenantId: tenantId,
    isCentralOrderingEnabled,
    isCentralRouting,
  } = useReceivingSearchContext();

  /* Data fetching */

  const {
    isLoading: isLocationsLoading,
    locations,
  } = useLocationsQuery({ consortium: isCentralOrderingEnabled });

  const {
    isLoading: isTitleLoading,
    title,
  } = useTitle(titleId, { tenantId });

  const {
    isLoading: isOrderLineLoading,
    orderLine,
  } = useOrderLine(title?.poLineId, { tenantId });

  const {
    isLoading: isOrderLoading,
    order,
  } = useOrder(orderLine?.purchaseOrderId, { tenantId });

  const {
    isLoading: isRestrictionsLoading,
    restrictions,
  } = useAcqRestrictions(
    titleId,
    title?.acqUnitIds || [],
    { tenantId },
  );

  /* Mutations */

  const { mutatePiece } = usePieceMutator({ tenantId });
  const { unreceive } = useUnreceive({ tenantId });

  const {
    isConfirmReceiving,
    onCancelReceive,
    onConfirmReceive,
    onQuickReceive,
  } = usePieceQuickReceiving({
    order,
    tenantId,
  });

  /* Constants */

  const canDeletePiece = !(!orderLine?.checkinItems && order?.workflowStatus === ORDER_STATUSES.pending);
  const instanceId = title?.instanceId;
  const pieceLocationId = initialValues?.locationId;
  const confirmReceivingModalLabel = intl.formatMessage({ id: 'ui-receiving.piece.confirmReceiving.title' });

  /* Memoized values */

  const locationIds = useMemo(() => {
    const poLineLocationIds = (orderLine?.locations?.map(({ locationId }) => locationId) ?? []).filter(Boolean);

    return (pieceLocationId ? [...new Set([...poLineLocationIds, pieceLocationId])] : poLineLocationIds);
  }, [orderLine, pieceLocationId]);

  /* Callbacks */

  const onCloseForm = useCallback(() => {
    const pathname = (isCentralRouting ? CENTRAL_RECEIVING_ROUTE_VIEW : RECEIVING_ROUTE_VIEW).replace(':id', titleId);

    history.push({ pathname, search });
  }, [
    history,
    isCentralRouting,
    search,
    titleId,
  ]);

  const onSubmit = useCallback((piece, options) => {
    return mutatePiece({ piece, options })
      .then((res) => {
        showCallout({
          messageId: 'ui-receiving.piece.actions.savePiece.success',
          type: 'success',
        });

        return res;
      })
      .catch(async ({ response }) => {
        const hasCommonErrors = await handleCommonErrors(showCallout, response);

        if (!hasCommonErrors) {
          showCallout({
            messageId: 'ui-receiving.piece.actions.savePiece.error',
            type: 'error',
          });
        }
      });
  }, [mutatePiece, showCallout]);

  /* --- */

  const isLoading = (
    isLoadingProp
    || isTitleLoading
    || isOrderLineLoading
    || isOrderLoading
    || isLocationsLoading
    || isRestrictionsLoading
  );

  if (isLoading) {
    return <LoadingView />;
  }

  console.log('title', title);
  console.log('initValue', initialValues);
  console.log('orderLine', orderLine);
  console.log('order', order);
  console.log('locations', locations);
  console.log('restrictions', restrictions);

  return (
    <>
      PieceFormContainer

      <ConfirmationModal
        aria-label={confirmReceivingModalLabel}
        id="confirm-receiving"
        open={isConfirmReceiving}
        confirmLabel={intl.formatMessage({ id: 'ui-receiving.piece.actions.confirm' })}
        heading={confirmReceivingModalLabel}
        message={intl.formatMessage({ id: 'ui-receiving.piece.confirmReceiving.message' })}
        onCancel={onCancelReceive}
        onConfirm={onConfirmReceive}
      />
    </>
  );
};

PieceFormContainer.propTypes = {
  initialValues: PropTypes.object,
  isLoading: PropTypes.bool,
};
