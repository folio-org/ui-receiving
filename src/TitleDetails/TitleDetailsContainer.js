import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import {
  batchFetch,
  baseManifest,
  LoadingPane,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { PO_LINES_API } from '../common/constants';
import { ITEM_STATUS } from './constants';
import {
  checkInResource,
  locationsResource,
  orderPiecesResource,
  pieceResource,
  receivingResource,
  titleResource,
  itemsResource,
  requestsResource,
} from '../common/resources';
import TitleDetails from './TitleDetails';
import {
  checkInItems,
  unreceivePiece,
} from './utils';

const TitleDetailsContainer = ({ location, history, mutator, match }) => {
  const titleId = match.params.id;
  const showCallout = useShowCallout();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState({});
  const [poLine, setPoLine] = useState({});
  const [pieces, setPieces] = useState();
  const [locations, setLocations] = useState();
  const [items, setItems] = useState();
  const [requests, setRequests] = useState();

  const fetchReceivingResources = useCallback(
    (lineId) => {
      setPieces();
      setItems();
      setRequests();

      return mutator.pieces.GET({
        params: {
          query: `poLineId==${lineId} sortby receiptDate`,
        },
      })
        .then((fetchedPieces) => {
          setPieces(fetchedPieces);

          const itemsIds = fetchedPieces.filter(({ itemId }) => itemId).map(({ itemId }) => itemId);
          const requestsPromise = batchFetch(mutator.requests, fetchedPieces, (piecesChunk) => {
            const itemIdsQuery = piecesChunk
              .filter(piece => piece.itemId)
              .map(piece => `itemId=${piece.itemId}`)
              .join(' or ');

            return itemIdsQuery ? `(${itemIdsQuery}) and status="Open*"` : '';
          });

          return Promise.all([batchFetch(mutator.items, itemsIds), requestsPromise]);
        })
        .then(([pieceItems, itemRequests]) => {
          setItems(pieceItems);
          setRequests(itemRequests);
        })
        .catch(() => {
          setPieces([]);
          setItems([]);
          setRequests([]);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [poLine.id],
  );

  useEffect(
    () => {
      setIsLoading(true);
      setTitle({});
      setPoLine({});

      mutator.title.GET()
        .then(response => {
          setTitle(response);

          return mutator.poLine.GET({
            path: `${PO_LINES_API}/${response.poLineId}`,
          });
        })
        .then(line => {
          setPoLine(line);

          return fetchReceivingResources(line.id);
        })
        .catch(() => {
          showCallout({ messageId: 'ui-receiving.title.actions.load.error', type: 'error' });
        })
        .finally(() => {
          setIsLoading(false);
        });

      if (!locations) {
        mutator.locations.GET()
          .then(setLocations)
          .catch(() => setLocations([]));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [titleId],
  );

  const onClose = useCallback(
    () => {
      history.push({
        pathname: '/receiving',
        search: location.search,
      });
    },
    [location.search, history],
  );

  const onEdit = useCallback(
    () => history.push({
      pathname: `/receiving/${title.id}/edit`,
      search: location.search,
    }),
    [history, title.id, location.search],
  );

  const onAddPiece = useCallback(
    (values) => {
      const mutatorMethod = values.id ? 'PUT' : 'POST';
      const actionType = values.id ? 'updatePiece' : 'addPiece';

      mutator.orderPieces[mutatorMethod](values)
        .then(() => showCallout({
          messageId: `ui-receiving.piece.actions.${actionType}.success`,
          type: 'success',
          values: { caption: values.caption },
        }))
        .catch(() => {
          showCallout({
            messageId: `ui-receiving.piece.actions.${actionType}.error`,
            type: 'error',
            values: { caption: values.caption },
          });
        })
        .finally(() => fetchReceivingResources(poLine.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchReceivingResources],
  );

  const onCheckIn = useCallback(
    (values) => {
      const mutatorMethod = values.id ? 'PUT' : 'POST';

      mutator.orderPieces[mutatorMethod](values)
        .then(piece => {
          showCallout({
            messageId: 'ui-receiving.piece.actions.addPiece.success',
            type: 'success',
            values: { caption: values.caption },
          });

          return checkInItems({
            ...piece,
            itemStatus: ITEM_STATUS.inProcess,
          }, mutator.checkIn);
        })
        .catch(() => showCallout({ messageId: 'ui-receiving.piece.actions.checkInItem.error', type: 'error' }))
        .finally(() => fetchReceivingResources(poLine.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchReceivingResources],
  );

  const onReceive = useCallback(
    (values) => {
      return checkInItems(values, mutator.checkIn)
        .then(() => {
          showCallout({
            messageId: 'ui-receiving.piece.actions.checkInItem.success',
            type: 'success',
            values: { caption: values.caption },
          });
        })
        .catch(() => showCallout({ messageId: 'ui-receiving.piece.actions.checkInItem.error', type: 'error' }))
        .finally(() => fetchReceivingResources(poLine.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchReceivingResources, poLine.id],
  );

  const onUnreceivePiece = useCallback(
    (piece) => {
      unreceivePiece(piece, mutator.receive)
        .then(() => {
          showCallout({
            messageId: 'ui-receiving.piece.actions.unreceivePiece.success',
            type: 'success',
            values: { caption: piece.caption },
          });
        })
        .catch(() => {
          showCallout({
            messageId: 'ui-receiving.piece.actions.unreceivePiece.error',
            type: 'error',
            values: { caption: piece.caption },
          });
        })
        .finally(() => fetchReceivingResources(poLine.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchReceivingResources, poLine.id],
  );

  if (isLoading || !(locations && pieces && items && requests)) {
    return (<LoadingPane onClose={onClose} />);
  }

  return (
    <TitleDetails
      items={items}
      locations={locations}
      onAddPiece={onAddPiece}
      onCheckIn={onCheckIn}
      onClose={onClose}
      onEdit={onEdit}
      onReceive={onReceive}
      onUnreceivePiece={onUnreceivePiece}
      pieces={pieces}
      poLine={poLine}
      requests={requests}
      title={title}
    />
  );
};

TitleDetailsContainer.manifest = Object.freeze({
  title: {
    ...titleResource,
    accumulate: true,
    fetch: false,
  },
  poLine: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
  orderPieces: orderPiecesResource,
  pieces: pieceResource,
  locations: {
    ...locationsResource,
    fetch: false,
  },
  checkIn: checkInResource,
  receive: receivingResource,
  items: itemsResource,
  requests: requestsResource,
});

TitleDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(TitleDetailsContainer));
