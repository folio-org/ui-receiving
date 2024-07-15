import {
  useCallback,
  useRef,
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
import { useStripes } from '@folio/stripes/core';

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
import { isConsortiumEnabled } from '../utils';

export const TitleBindPiecesContainer = () => {
  const history = useHistory();
  const location = useLocation();
  const showCallout = useShowCallout();
  const stripes = useStripes();
  const { isCentralRouting } = useReceivingSearchContext();

  const isConsortium = isConsortiumEnabled(stripes);
  const currentTenant = stripes.okapi?.tenant;

  const { id: titleId } = useParams();

  const [open, toggleOpen] = useToggle(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const bindPieceData = useRef(null);
  const barCodesWithOpenRequests = useRef([]);

  const { bindPieces, isBinding } = useBindPiecesMutation();

  const {
    isLoading,
    holdingLocations = [],
    orderLine,
    pieces = [],
    title,
  } = useTitleHydratedPieces({
    titleId,
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
      setShowDeleteMessage(false);

      return null;
    }

    return bindItems({
      ...bindPieceData.current,
      requestsAction,
    });
  };

  const onSubmit = async (values) => {
    const selectedItems = values.receivedItems.filter(({ checked }) => checked);
    const openRequests = selectedItems.filter(({ itemId, request }) => itemId && request);

    const requestData = {
      poLineId: orderLine.id,
      bindPieceIds: selectedItems.map(({ id }) => id),
      bindItem: {
        ...values.bindItem,
      },
    };

    if (openRequests?.length) {
      let hasDifferentRequesterId = false;

      if (isConsortium) {
        hasDifferentRequesterId = openRequests.some(({ request }) => request.receivingTenantId !== currentTenant);
      }

      setShowDeleteMessage(hasDifferentRequesterId);
      bindPieceData.current = requestData;
      barCodesWithOpenRequests.current = openRequests.filter(Boolean).map(({ barcode }) => barcode);
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
        showDeleteMessage={showDeleteMessage}
        open={open}
        barCodesWithOpenRequests={barCodesWithOpenRequests.current}
      />
    </>
  );
};
