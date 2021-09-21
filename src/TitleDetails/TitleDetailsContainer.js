import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  batchFetch,
  itemsResource,
  LIMIT_MAX,
  LoadingPane,
  locationsManifest,
  organizationsManifest,
  pieceResource,
  piecesResource,
  requestsResource,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  ORDERS_API,
  PO_LINES_API,
} from '../common/constants';
import {
  titleResource,
} from '../common/resources';
import {
  usePieceMutator,
  useQuickReceive,
} from '../common/hooks';
import {
  getHydratedPieces,
  handleCommonErrors,
  handleReceiveErrorResponse,
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
  const [locations, setLocations] = useState();
  const [vendorsMap, setVendorsMap] = useState();

  const { mutatePiece } = usePieceMutator();
  const { quickReceive } = useQuickReceive();

  const fetchReceivingResources = useCallback(
    (lineId) => {
      setPieces();

      return mutator.pieces.GET({
        params: {
          limit: `${LIMIT_MAX}`,
          query: `titleId==${titleId} and poLineId==${lineId} sortby receiptDate`,
        },
      })
        .then(piecesResponse => getHydratedPieces(piecesResponse, mutator.requests, mutator.items))
        .then(setPieces)
        .catch(() => {
          setPieces([]);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [titleId],
  );

  useEffect(
    () => {
      setIsLoading(true);
      setTitle({});
      setPoLine({});
      setOrder({});
      setVendorsMap();

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

          return Promise.all([orderPromise, line, fetchReceivingResources(line.id)]);
        })
        .then(([orderResp, line]) => {
          setOrder(orderResp);

          const vendorsIds = [...new Set(
            [orderResp.vendor, line?.physical?.materialSupplier, line?.eresource?.accessProvider].filter(Boolean),
          )];

          return batchFetch(mutator.vendors, vendorsIds);
        })
        .then(vendorsResp => {
          setVendorsMap(vendorsResp.reduce((acc, v) => ({ ...acc, [v.id]: v.name }), {}));
        })
        .catch(() => {
          showCallout({ messageId: 'ui-receiving.title.actions.load.error', type: 'error' });
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchReceivingResources, showCallout, titleId],
  );

  useEffect(() => {
    setLocations();

    mutator.locations.GET().then(setLocations);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

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
      return mutatePiece(values)
        .then(() => {
          showCallout({
            messageId: 'ui-receiving.piece.actions.savePiece.success',
            type: 'success',
          });
        })
        .catch(async ({ response }) => {
          const hasCommonErrors = await handleCommonErrors(showCallout, response);

          if (!hasCommonErrors) {
            showCallout({
              messageId: 'ui-receiving.piece.actions.savePiece.error',
              type: 'error',
            });
          }
        })
        .finally(() => fetchReceivingResources(poLine.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchReceivingResources, poLine, showCallout],
  );

  const onCheckIn = useCallback(
    (values) => {
      return quickReceive(values)
        .then(() => {
          if (!values.id) {
            showCallout({
              messageId: 'ui-receiving.piece.actions.savePiece.success',
              type: 'success',
            });
          }
          showCallout({
            messageId: 'ui-receiving.piece.actions.checkInItem.success',
            type: 'success',
            values: { enumeration: values.enumeration },
          });
        })
        .catch(({ response }) => {
          handleReceiveErrorResponse(showCallout, response);
        })
        .finally(() => fetchReceivingResources(poLine.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchReceivingResources, poLine.id, showCallout],
  );

  const deletePiece = useCallback((piece) => {
    const apiCall = piece?.id ? mutator.orderPieces.DELETE({ id: piece.id }) : Promise.resolve();

    apiCall.then(
      () => {
        showCallout({
          messageId: 'ui-receiving.piece.actions.delete.success',
          type: 'success',
          values: { enumeration: piece?.enumeration },
        });
      },
      async (response) => {
        const hasCommonErrors = await handleCommonErrors(showCallout, response);

        if (!hasCommonErrors) {
          showCallout({
            messageId: 'ui-receiving.piece.actions.delete.error',
            type: 'error',
            values: { enumeration: piece?.enumeration },
          });
        }
      },
    ).finally(() => fetchReceivingResources(poLine.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchReceivingResources, poLine.id, showCallout]);

  if (isLoading || !(pieces || locations || vendorsMap)) {
    return (
      <LoadingPane
        id="pane-title-details"
        onClose={onClose}
      />
    );
  }

  return (
    <TitleDetails
      deletePiece={deletePiece}
      locations={locations}
      onAddPiece={onAddPiece}
      onCheckIn={onCheckIn}
      onClose={onClose}
      onEdit={onEdit}
      order={order}
      pieces={pieces}
      poLine={poLine}
      title={title}
      vendorsMap={vendorsMap}
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
  orderPieces: pieceResource,
  pieces: piecesResource,
  items: itemsResource,
  requests: requestsResource,
  locations: {
    ...locationsManifest,
    fetch: false,
  },
  vendors: {
    ...organizationsManifest,
    fetch: false,
    accumulate: true,
  },
});

TitleDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(TitleDetailsContainer));
