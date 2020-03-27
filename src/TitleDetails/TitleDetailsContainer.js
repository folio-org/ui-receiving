import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  ITEM_STATUS,
  LoadingPane,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  ORDERS_API,
  PO_LINES_API,
} from '../common/constants';
import {
  checkInResource,
  orderPiecesResource,
  pieceResource,
  receivingResource,
  titleResource,
  itemsResource,
  requestsResource,
} from '../common/resources';
import {
  checkInItems,
  getDehydratedPiece,
  getHydratedPieces,
} from '../common/utils';
import TitleDetails from './TitleDetails';

const TitleDetailsContainer = ({ location, history, mutator, match }) => {
  const titleId = match.params.id;
  const showCallout = useShowCallout();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState({});
  const [poLine, setPoLine] = useState({});
  const [pieces, setPieces] = useState();
  const [order, setOrder] = useState({});

  const fetchReceivingResources = useCallback(
    (lineId) => {
      setPieces();

      return mutator.pieces.GET({
        params: {
          query: `poLineId==${lineId} sortby receiptDate`,
        },
      })
        .then(piecesResponse => getHydratedPieces(piecesResponse, mutator.requests, mutator.items))
        .then(setPieces)
        .catch(() => {
          setPieces([]);
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
      setOrder({});

      mutator.title.GET()
        .then(response => {
          setTitle(response);

          return mutator.poLine.GET({
            path: `${PO_LINES_API}/${response.poLineId}`,
          });
        })
        .then(line => {
          setPoLine(line);

          const orderPromise = mutator.purchaseOrder.GET({
            path: `${ORDERS_API}/${line.purchaseOrderId}`,
          });

          return Promise.all([orderPromise, fetchReceivingResources(line.id)]);
        })
        .then(([orderResp]) => setOrder(orderResp))
        .catch(() => {
          showCallout({ messageId: 'ui-receiving.title.actions.load.error', type: 'error' });
        })
        .finally(() => {
          setIsLoading(false);
        });
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

      const piece = getDehydratedPiece(values);

      mutator.orderPieces[mutatorMethod](piece)
        .then(() => showCallout({
          messageId: `ui-receiving.piece.actions.${actionType}.success`,
          type: 'success',
          values: { caption: piece.caption },
        }))
        .catch(() => {
          showCallout({
            messageId: `ui-receiving.piece.actions.${actionType}.error`,
            type: 'error',
            values: { caption: piece.caption },
          });
        })
        .finally(() => fetchReceivingResources(poLine.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchReceivingResources],
  );

  const onCheckIn = useCallback(
    (values) => {
      const dehydratedPiece = getDehydratedPiece(values);
      const savePromise = values.id
        ? Promise.resolve(dehydratedPiece)
        : mutator.orderPieces.POST(dehydratedPiece);

      return savePromise
        .then(piece => {
          if (!values.id) {
            showCallout({
              messageId: 'ui-receiving.piece.actions.addPiece.success',
              type: 'success',
              values: { caption: values.caption },
            });
          }

          return checkInItems(
            [{
              ...piece,
              checked: true,
              itemStatus: ITEM_STATUS.inProcess,
            }],
            mutator.checkIn,
          );
        })
        .then(() => showCallout({
          messageId: 'ui-receiving.piece.actions.checkInItem.success',
          type: 'success',
          values: { caption: values.caption },
        }))
        .catch(() => showCallout({ messageId: 'ui-receiving.piece.actions.checkInItem.error', type: 'error' }))
        .finally(() => fetchReceivingResources(poLine.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchReceivingResources],
  );

  if (isLoading || !pieces) {
    return (<LoadingPane onClose={onClose} />);
  }

  return (
    <TitleDetails
      onAddPiece={onAddPiece}
      onCheckIn={onCheckIn}
      onClose={onClose}
      onEdit={onEdit}
      order={order}
      pieces={pieces}
      poLine={poLine}
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
  purchaseOrder: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
  orderPieces: orderPiecesResource,
  pieces: pieceResource,
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
