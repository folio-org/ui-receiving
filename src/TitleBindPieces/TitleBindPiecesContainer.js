import {
  useCallback,
  useRef,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  useShowCallout,
  useToggle,
  PIECE_STATUS,
} from '@folio/stripes-acq-components';
import {
  LoadingPane,
  Paneset,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import { useTitleHydratedPieces } from '../common/hooks';

import { useBindPiecesMutation } from './hooks';
import TitleBindPieces from './TitleBindPieces';
import { TitleBindPiecesConfirmationModal } from './TitleBindPiecesConfirmationModal';

function TitleBindPiecesContainer({ history, location, match }) {
  const titleId = match.params.id;
  const showCallout = useShowCallout();
  const [open, toggleOpen] = useToggle(false);
  const bindPieceData = useRef(null);

  const { bindPieces } = useBindPiecesMutation();

  const {
    isLoading,
    holdingLocations,
    orderLine,
    pieces = [],
    title,
  } = useTitleHydratedPieces({
    titleId,
    receivingStatus: PIECE_STATUS.received,
    searchQuery: 'isBound==false',
  });

  const onCancel = useCallback(() => {
    history.push({
      pathname: `/receiving/${titleId}/view`,
      search: location.search,
    });
  }, [history, titleId, location.search]);

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

    return bindItems({
      ...bindPieceData.current,
      requestsAction,
    });
  };

  const onSubmit = async (values) => {
    const selectedItems = values.receivedItems.filter(({ checked }) => checked);
    const hasOpenRequests = selectedItems.some(({ itemId, request }) => itemId && request);
    // TODO https://folio-org.atlassian.net/browse/UIREC-353  5. Bind button (ECS-enabled system, items associated, at least one request, bound item to go to different tenant than requests)
    const requestData = {
      poLineId: orderLine.id,
      bindPieceIds: selectedItems.map(({ id }) => id),
      bindItem: {
        ...values.bindItem,
      },
    };

    if (hasOpenRequests) {
      bindPieceData.current = requestData;
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
      />
      <TitleBindPiecesConfirmationModal
        id="confirm-binding-modal"
        onCancel={toggleOpen}
        onConfirm={onConfirm}
        open={open}
      />
    </>
  );
}

TitleBindPiecesContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default stripesConnect(TitleBindPiecesContainer);
