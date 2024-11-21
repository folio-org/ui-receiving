import identity from 'lodash/identity';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import { LoadingView } from '@folio/stripes/components';
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

import { ConfirmReceivingModal } from '../../common/components';
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
  CENTRAL_RECEIVING_PIECE_CREATE_ROUTE,
  CENTRAL_RECEIVING_ROUTE_VIEW,
  RECEIVING_PIECE_CREATE_ROUTE,
  RECEIVING_ROUTE_VIEW,
} from '../../constants';
import { useReceivingSearchContext } from '../../contexts';
import {
  PIECE_ACTION_NAMES,
  PIECE_FORM_CHECKBOX_FIELD_NAMES,
  PIECE_FORM_FIELD_NAMES,
  PIECE_FORM_SERVICE_FIELD_NAMES,
} from '../constants';
import {
  usePieceHoldingAbandonmentCheck,
  usePieceQuickReceiving,
} from '../hooks';
import PieceForm from './PieceForm';

/* Set of post-submission actions that should not close the form after piece saving */
const NOT_CLOSURE_ACTIONS_SET = new Set([PIECE_ACTION_NAMES.saveAndCreate]);

export const PieceFormContainer = ({
  initialValues,
  isLoading: isLoadingProp = false,
  paneTitle,
}) => {
  const showCallout = useShowCallout();
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

  const onCreateAnother = useCallback((values) => {
    const pieceTemplate = {
      ...omit(values, [
        'id',
        'itemId',
        'receivedDate',
        PIECE_FORM_FIELD_NAMES.receivingStatus,
      ]),
      [PIECE_FORM_FIELD_NAMES.isCreateItem]: values?.itemId ? true : values?.isCreateItem,
      [PIECE_FORM_SERVICE_FIELD_NAMES.isCreateAnother]: true,
    };

    const pathname = (isCentralRouting ? CENTRAL_RECEIVING_PIECE_CREATE_ROUTE : RECEIVING_PIECE_CREATE_ROUTE).replace(':id', titleId);

    history.push({
      pathname,
      search,
      state: { pieceTemplate },
    });
  }, [history, isCentralRouting, search, titleId]);

  const onSubmit = useCallback((formValues) => {
    const {
      deleteHolding,
      postSubmitAction,
    } = formValues;

    const options = {
      searchParams: { ...(deleteHolding ? { deleteHolding } : {}) },
    };

    const piece = omit(formValues, Object.values(PIECE_FORM_SERVICE_FIELD_NAMES));

    return mutatePiece({ piece, options })
      .then((res) => {
        showCallout({
          messageId: 'ui-receiving.piece.actions.savePiece.success',
          type: 'success',
        });

        return res;
      })
      .then((data) => {
        if (!postSubmitAction) return data;

        const postSubmitHandler = new Map([
          [PIECE_ACTION_NAMES.saveAndCreate, onCreateAnother],
          [PIECE_ACTION_NAMES.quickReceive, onQuickReceive],
        ]).get(postSubmitAction) || identity;

        return postSubmitHandler(data);
      })
      .then((data) => {
        if (!NOT_CLOSURE_ACTIONS_SET.has(postSubmitAction)) onCloseForm();

        return data;
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
  }, [
    mutatePiece,
    onCloseForm,
    onCreateAnother,
    onQuickReceive,
    showCallout,
  ]);

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

  const formInitialValues = useMemo(() => {
    if (!initialValues) return {};

    const initialCheckboxValues = (
      PIECE_FORM_CHECKBOX_FIELD_NAMES.reduce((acc, key) => {
        acc[key] = Boolean(initialValues[key]);

        return acc;
      }, {})
    );

    return { ...initialValues, ...initialCheckboxValues };
  }, [initialValues]);

  const { checkHoldingAbandonment } = usePieceHoldingAbandonmentCheck(formInitialValues);

  const isLoading = (
    !initialValues
    || isLoadingProp
    || isLocationsLoading
    || isTitleLoading
    || isOrderLineLoading
    || isOrderLoading
    || isRestrictionsLoading
  );

  if (isLoading) return <LoadingView />;

  return (
    <>
      <PieceForm
        canDeletePiece={canDeletePiece}
        checkHoldingAbandonment={checkHoldingAbandonment}
        createInventoryValues={createInventoryValues}
        initialValues={formInitialValues}
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

      <ConfirmReceivingModal
        open={isConfirmReceiving}
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
