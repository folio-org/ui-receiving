import uniq from 'lodash/uniq';
import {
  useCallback,
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
  PIECE_FORMAT,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  useHoldingsAndLocations,
  useReceive,
  useTitleHydratedPieces,
} from '../common/hooks';
import {
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

function TitleReceiveContainer({ history, location, match }) {
  const showCallout = useShowCallout();
  const {
    crossTenant,
    isCentralRouting,
    targetTenantId,
  } = useReceivingSearchContext();

  const titleId = match.params.id;

  const {
    pieces = [],
    title,
    orderLine: poLine,
    isLoading: isPiecesLoading,
  } = useTitleHydratedPieces({
    titleId,
    tenantId: targetTenantId,
    receivingStatus: `(${EXPECTED_PIECES_SEARCH_VALUE})`,
  });

  const instanceId = title?.instanceId;

  const { receive } = useReceive();

  const uniqueTenants = useMemo(() => {
    return pieces?.length
      ? uniq(pieces?.map(({ receivingTenantId }) => receivingTenantId).filter(Boolean))
      : [];
  }, [pieces]);

  const { locations, isFetching } = useHoldingsAndLocations({
    instanceId,
    tenants: uniqueTenants,
    tenantId: targetTenantId,
  });

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

  const isLoading = isPiecesLoading || isFetching;

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

TitleReceiveContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default stripesConnect(TitleReceiveContainer);
