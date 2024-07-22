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
  ORDER_FORMATS,
  ORDER_STATUSES,
  PIECE_FORMAT,
  PIECE_FORMAT_OPTIONS,
  useAcqRestrictions,
  useLocationsQuery,
  useOrderLine,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  useOrder,
  usePieceMutator,
  useTitle,
  useUnreceive,
} from '../../common/hooks';
import {
  handleCommonErrors,
  handleUnrecieveErrorResponse,
} from '../../common/utils';
import {
  CENTRAL_RECEIVING_ROUTE_VIEW,
  RECEIVING_ROUTE_VIEW,
} from '../../constants';
import { useReceivingSearchContext } from '../../contexts';
import { usePieceQuickReceiving } from '../hooks';
import PieceForm from './PieceForm';

export const PieceFormContainer = ({
  initialValues,
  isLoading: isLoadingProp = false,
  paneTitle,
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
  const orderFormat = orderLine?.orderFormat;
  const pieceFormatOptions = orderFormat === ORDER_FORMATS.PEMix
    ? PIECE_FORMAT_OPTIONS.filter(({ value }) => [PIECE_FORMAT.electronic, PIECE_FORMAT.physical].includes(value))
    : PIECE_FORMAT_OPTIONS.filter(({ value }) => value === initialValues?.format);

  /* Memoized values */

  const locationIds = useMemo(() => {
    const poLineLocationIds = (orderLine?.locations?.map(({ locationId }) => locationId) ?? []).filter(Boolean);

    return (pieceLocationId ? [...new Set([...poLineLocationIds, pieceLocationId])] : poLineLocationIds);
  }, [orderLine, pieceLocationId]);

  const createInventoryValues = useMemo(() => ({
    [PIECE_FORMAT.physical]: orderLine?.physical?.createInventory,
    [PIECE_FORMAT.electronic]: orderLine?.eresource?.createInventory,
    [PIECE_FORMAT.other]: orderLine?.physical?.createInventory,
  }), [orderLine]);

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

  const onSubmit = useCallback((formValues) => {
    // TODO: handle somewhere "Create another"
    const {
      deleteHolding = false,
      ...piece
    } = formValues;

    const options = {
      searchParams: { deleteHolding },
    };

    return mutatePiece({ piece, options })
      .then((res) => {
        showCallout({
          messageId: 'ui-receiving.piece.actions.savePiece.success',
          type: 'success',
        });

        return res;
      })
      .then(onCloseForm)
      .catch(async ({ response }) => {
        const hasCommonErrors = await handleCommonErrors(showCallout, response);

        if (!hasCommonErrors) {
          showCallout({
            messageId: 'ui-receiving.piece.actions.savePiece.error',
            type: 'error',
          });
        }
      });
  }, [mutatePiece, onCloseForm, showCallout]);

  const onDelete = useCallback((pieceToDelete, options = {}) => {
    const apiCall = pieceToDelete?.id
      ? mutatePiece({
        piece: pieceToDelete,
        options: {
          ...options,
          method: 'delete',
        },
      })
      : Promise.resolve();

    return apiCall
      .then(
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
      )
      .then(onCloseForm);
  }, [onCloseForm, mutatePiece, showCallout]);

  const onUnreceive = useCallback((pieces) => {
    return unreceive(pieces)
      .then(async () => {
        showCallout({
          messageId: 'ui-receiving.title.actions.unreceive.success',
          type: 'success',
        });
      })
      .then(onCloseForm)
      .catch(async (error) => handleUnrecieveErrorResponse({ error, showCallout, receivedItems: pieces }));
  }, [onCloseForm, showCallout, unreceive]);

  /* --- */

  const isLoading = (
    !initialValues
    || isLoadingProp
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
      <PieceForm
        canDeletePiece={canDeletePiece}
        createInventoryValues={createInventoryValues}
        initialValues={initialValues}
        instanceId={instanceId}
        onClose={onCloseForm}
        onDelete={onDelete}
        onQuickReceive={onQuickReceive}
        onSubmit={onSubmit}
        onUnreceive={onUnreceive}
        locationIds={locationIds}
        locations={locations}
        paneTitle={paneTitle}
        pieceFormatOptions={pieceFormatOptions}
        poLine={orderLine}
        restrictionsByAcqUnit={restrictions}
      />

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
  paneTitle: PropTypes.node.isRequired,
};
