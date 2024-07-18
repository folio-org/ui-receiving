import {
  useCallback,
  useState,
} from 'react';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import {
  useShowCallout,
  useToggle,
  PIECE_FORMAT,
  PIECE_STATUS,
} from '@folio/stripes-acq-components';
import {
  LoadingPane,
  Paneset,
} from '@folio/stripes/components';

import { useTitleHydratedPieces } from '../../common/hooks';
import {
  CENTRAL_RECEIVING_ROUTE,
  RECEIVING_ROUTE,
} from '../../constants';
import { useReceivingSearchContext } from '../../contexts';
import { TRANSFER_REQUEST_ACTIONS } from '../constants';
import { useBindPiecesMutation } from '../hooks';
import TitleBindPieces from '../TitleBindPieces';
import { TitleBindPiecesConfirmationModal } from '../TitleBindPiecesConfirmationModal';

export const TitleBindPiecesContainer = () => {
  const history = useHistory();
  const location = useLocation();
  const showCallout = useShowCallout();
  const {
    activeTenantId,
    crossTenant,
    isCentralRouting,
    targetTenantId,
  } = useReceivingSearchContext();

  const { id: titleId } = useParams();

  const [open, toggleOpen] = useToggle(false);
  const [openRequests, setOpenRequests] = useState([]);
  const [bindPieceData, setBindPieceData] = useState({});
  const { bindPieces, isBinding } = useBindPiecesMutation();

  const {
    isLoading,
    holdingLocations = [],
    orderLine,
    pieces = [],
    title,
  } = useTitleHydratedPieces({
    titleId,
    tenantId: targetTenantId,
    receivingStatus: PIECE_STATUS.received,
    searchQuery: `isBound==false and format==${PIECE_FORMAT.physical}`,
  });

  const onCancel = useCallback(() => {
    history.push({
      pathname: `${isCentralRouting ? CENTRAL_RECEIVING_ROUTE : RECEIVING_ROUTE}/${titleId}/view`,
      search: location.search,
    });
  }, [history, isCentralRouting, titleId, location.search]);

  const bindItems = (requestData) => {
    return bindPieces(requestData)
      .then(() => {
        onCancel();
        showCallout({ messageId: 'ui-receiving.bind.pieces.create.success' });
      }).catch(() => {
        showCallout({
          type: 'error',
          messageId: 'ui-receiving.bind.pieces.create.error',
        });
      });
  };

  const onConfirm = (requestsAction) => {
    toggleOpen();

    if (requestsAction === TRANSFER_REQUEST_ACTIONS.cancel) {
      return null;
    }

    return bindItems({
      ...bindPieceData,
      requestsAction,
    });
  };

  const onSubmit = async (values) => {
    const selectedItems = values.receivedItems.filter(({ checked }) => checked);
    const piecesWithOpenRequests = selectedItems.filter(({ itemId, request }) => itemId && request);

    const requestData = {
      poLineId: orderLine.id,
      bindPieceIds: selectedItems.map(({ id }) => id),
      bindItem: {
        ...values.bindItem,
      },
      ...(orderLine.isPackage ? { instanceId: title.instanceId } : {}),
    };

    if (piecesWithOpenRequests?.length) {
      setOpenRequests(piecesWithOpenRequests);
      setBindPieceData(requestData);
      toggleOpen();
    } else {
      bindItems(requestData);
    }
  };

  if (isLoading) {
    return (
      <Paneset>
        <LoadingPane />
      </Paneset>
    );
  }

  const initialValues = { receivedItems: pieces };
  const paneTitle = `${orderLine?.poLineNumber} - ${title?.title}`;

  return (
    <>
      <TitleBindPieces
        initialValues={initialValues}
        onCancel={onCancel}
        onSubmit={onSubmit}
        paneTitle={paneTitle}
        instanceId={title.instanceId}
        locations={holdingLocations}
        isLoading={isBinding}
      />
      <TitleBindPiecesConfirmationModal
        id="confirm-binding-modal"
        onCancel={toggleOpen}
        onConfirm={onConfirm}
        open={open}
        activeTenantId={activeTenantId}
        openRequests={openRequests}
        crossTenant={crossTenant}
      />
    </>
  );
};
