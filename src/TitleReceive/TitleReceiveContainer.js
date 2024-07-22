import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  LoadingPane,
  Paneset,
} from '@folio/stripes/components';
import {
  baseManifest,
  itemsResource,
  LIMIT_MAX,
  LINES_API,
  PIECE_FORMAT,
  pieceResource,
  piecesResource,
  requestsResource,
  useLocationsQuery,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  titleResource,
} from '../common/resources';
import {
  useReceive,
} from '../common/hooks';
import {
  getHydratedPieces,
  getReceivingPieceItemStatus,
  handleReceiveErrorResponse,
} from '../common/utils';
import {
  CENTRAL_RECEIVING_ROUTE,
  RECEIVING_ROUTE,
} from '../constants';
import { useReceivingSearchContext } from '../contexts';
import { EXPECTED_PIECES_SEARCH_VALUE } from '../Piece';
import TitleReceive from './TitleReceive';
import OpenedRequestsModal from './OpenedRequestsModal';

function TitleReceiveContainer({ history, location, match, mutator }) {
  const showCallout = useShowCallout();
  const {
    crossTenant,
    isCentralOrderingEnabled,
    isCentralRouting,
  } = useReceivingSearchContext();

  const titleId = match.params.id;
  const [pieces, setPieces] = useState();
  const [title, setTitle] = useState();
  const [poLine, setPoLine] = useState();

  const poLineId = title?.poLineId;
  const instanceId = title?.instanceId;

  const { receive } = useReceive();

  const {
    isLoading: isLocationsLoading,
    locations,
  } = useLocationsQuery({ consortium: isCentralOrderingEnabled });

  useEffect(
    () => {
      mutator.title.GET()
        .then(setTitle);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [titleId],
  );

  useEffect(
    () => {
      if (poLineId) {
        mutator.poLine.GET({
          path: `${LINES_API}/${poLineId}`,
        }).then(setPoLine);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [poLineId],
  );

  useEffect(
    () => {
      if (poLineId) {
        const filterQuery = `titleId=${titleId} and poLineId==${poLineId} and receivingStatus==(${EXPECTED_PIECES_SEARCH_VALUE})`;

        mutator.pieces.GET({
          params: {
            limit: `${LIMIT_MAX}`,
            query: `${filterQuery} sortby locationId`,
          },
        })
          .then(piecesResponse => getHydratedPieces(piecesResponse, mutator.requests, mutator.items))
          .then(setPieces);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [titleId, poLineId],
  );

  const onCancel = useCallback(
    () => {
      history.push({
        pathname: `${isCentralRouting ? CENTRAL_RECEIVING_ROUTE : RECEIVING_ROUTE}/${titleId}/view`,
        search: location.search,
      });
    },
    [history, isCentralRouting, titleId, location.search],
  );
  const [receivedPiecesWithRequests, setReceivedPiecesWithRequests] = useState([]);
  const closeOpenedRequestsModal = useCallback(
    () => {
      setReceivedPiecesWithRequests([]);
      onCancel();
    },
    [onCancel],
  );

  const onSubmit = useCallback(
    ({ receivedItems }) => {
      receive(
        receivedItems
          .filter(({ checked }) => checked === true)
          .map(item => ({
            ...item,
            itemStatus: getReceivingPieceItemStatus(item),
          })),
      )
        .then(() => {
          showCallout({
            messageId: 'ui-receiving.title.actions.receive.success',
            type: 'success',
          });
          const receivedItemsWithRequests = receivedItems.filter(({ request }) => Boolean(request));

          if (receivedItemsWithRequests.length) {
            setReceivedPiecesWithRequests(receivedItemsWithRequests);
          } else {
            onCancel();
          }
        })
        .catch(async ({ response }) => {
          await handleReceiveErrorResponse(showCallout, response);
          onCancel();
        });
    },
    [receive, showCallout, onCancel],
  );

  const createInventoryValues = useMemo(
    () => ({
      [PIECE_FORMAT.physical]: poLine?.physical?.createInventory,
      [PIECE_FORMAT.electronic]: poLine?.eresource?.createInventory,
      [PIECE_FORMAT.other]: poLine?.physical?.createInventory,
    }),
    [poLine],
  );

  const isLoading = !(pieces && poLine && title) || isLocationsLoading;

  if (isLoading) {
    return (
      <Paneset>
        <LoadingPane />
      </Paneset>
    );
  }

  const initialValues = { receivedItems: pieces };
  const paneTitle = `${poLine.poLineNumber} - ${title.title}`;

  return (
    <>
      <TitleReceive
        crossTenant={crossTenant}
        createInventoryValues={createInventoryValues}
        initialValues={initialValues}
        instanceId={instanceId}
        onCancel={onCancel}
        onSubmit={onSubmit}
        paneTitle={paneTitle}
        receivingNote={poLine?.details?.receivingNote}
        locations={locations}
        poLine={poLine}
      />
      {!!receivedPiecesWithRequests.length && (
        <OpenedRequestsModal
          closeModal={closeOpenedRequestsModal}
          pieces={receivedPiecesWithRequests}
        />
      )}
    </>
  );
}

TitleReceiveContainer.manifest = Object.freeze({
  title: {
    ...titleResource,
    accumulate: true,
    fetch: false,
    tenant: '!{tenantId}',
  },
  pieces: {
    ...piecesResource,
    tenant: '!{tenantId}',
  },
  poLine: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
    tenant: '!{tenantId}',
  },

  // TODO: fetch items and requests (after MODORDERS-1138) from related tenants
  items: itemsResource,
  requests: requestsResource,

  piece: {
    ...pieceResource,
    tenant: '!{tenantId}',
  },
});

TitleReceiveContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(TitleReceiveContainer);
