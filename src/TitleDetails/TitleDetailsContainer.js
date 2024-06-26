import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  batchFetch,
  itemsResource,
  LIMIT_MAX,
  LINES_API,
  LoadingPane,
  ORDERS_API,
  organizationsManifest,
  piecesResource,
  useLocationsQuery,
  useShowCallout,
  PIECE_STATUS,
} from '@folio/stripes-acq-components';

import { titleResource } from '../common/resources';
import {
  usePieceMutator,
  useQuickReceive,
  useUnreceive,
} from '../common/hooks';
import {
  handleCommonErrors,
  handleReceiveErrorResponse,
  getPieceById,
  handleUnrecieveErrorResponse,
} from '../common/utils';
import {
  CENTRAL_RECEIVING_ROUTE,
  RECEIVING_ROUTE,
} from '../constants';
import { useReceivingSearchContext } from '../contexts';
import { EXPECTED_PIECES_SEARCH_VALUE } from './constants';
import TitleDetails from './TitleDetails';

const TitleDetailsContainer = ({
  history,
  location,
  match,
  mutator,
  tenantId,
}) => {
  const titleId = match.params.id;

  const showCallout = useShowCallout();
  const {
    isCentralOrderingEnabled,
    isCentralRouting,
  } = useReceivingSearchContext();

  const [isLoading, setIsLoading] = useState();
  const [title, setTitle] = useState({});
  const [poLine, setPoLine] = useState({});
  const [piecesExistance, setPiecesExistance] = useState();
  const [order, setOrder] = useState({});
  const [vendorsMap, setVendorsMap] = useState({});

  const {
    isLoading: isLocationsLoading,
    locations,
  } = useLocationsQuery({ consortium: isCentralOrderingEnabled });

  const { mutatePiece } = usePieceMutator();
  const { quickReceive } = useQuickReceive();
  const { unreceive } = useUnreceive();

  const hasPieces = useCallback((lineId, status) => (
    mutator.pieces.GET({
      params: {
        limit: 1,
        query: `titleId==${titleId} and poLineId==${lineId} and receivingStatus==(${status})`,
      },
    })
      .then(data => Boolean(data.length))
      .catch(() => false)
      .then(flag => ({ [status]: flag }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [titleId]);

  const fetchReceivingResources = useCallback((lineId) => {
    setPiecesExistance();

    return Promise.all([
      hasPieces(lineId, EXPECTED_PIECES_SEARCH_VALUE),
      hasPieces(lineId, PIECE_STATUS.received),
      hasPieces(lineId, PIECE_STATUS.unreceivable),
    ])
      .then(existances => setPiecesExistance(existances.reduce(
        (acc, existance) => ({ ...acc, ...existance, key: new Date() }),
        {},
      )))
      .catch(() => setPiecesExistance({}));
  }, [hasPieces]);

  const getHoldingsItemsAndPieces = useCallback((holdingId, params = {}) => {
    const holdingsPieces = mutator.pieces.GET({
      params: {
        limit: `${LIMIT_MAX}`,
        query: `holdingId==${holdingId}`,
        ...params,
      },
      records: undefined,
    });

    // TODO: fetch from related tenants in central ordering and for central tenant
    const holdingsItems = mutator.items.GET({
      params: {
        limit: `${LIMIT_MAX}`,
        query: `holdingsRecordId==${holdingId}`,
        ...params,
      },
      records: undefined,
    });

    return Promise
      .all([holdingsPieces, holdingsItems])
      .then(([piecesInHolding, itemsInHolding]) => ({
        pieces: piecesInHolding,
        items: itemsInHolding,
      }))
      .catch(() => ({}));
  }, [mutator.items, mutator.pieces]);

  useEffect(
    () => {
      if (tenantId) {
        setIsLoading(true);
        setTitle({});
        setPoLine({});
        setOrder({});
        setVendorsMap();

        mutator.title.GET()
          .then(response => {
            setTitle(response);

            return mutator.poLine.GET({
              path: `${LINES_API}/${response.poLineId}`,
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
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchReceivingResources, showCallout, titleId, tenantId],
  );

  const onClose = useCallback(
    () => {
      history.push({
        pathname: isCentralRouting ? CENTRAL_RECEIVING_ROUTE : RECEIVING_ROUTE,
        search: location.search,
      });
    },
    [location.search, history, isCentralRouting],
  );

  const onEdit = useCallback(
    () => history.push({
      pathname: `${isCentralRouting ? CENTRAL_RECEIVING_ROUTE : RECEIVING_ROUTE}/${title.id}/edit`,
      search: location.search,
    }),
    [history, isCentralRouting, title.id, location.search],
  );

  const onAddPiece = useCallback(
    (piece, options) => {
      return mutatePiece({ piece, options })
        .then((res) => {
          showCallout({
            messageId: 'ui-receiving.piece.actions.savePiece.success',
            type: 'success',
          });

          return res;
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
        .then((res) => {
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

          return res;
        })
        .catch(({ response }) => {
          handleReceiveErrorResponse(showCallout, response);
        })
        .finally(() => fetchReceivingResources(poLine.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchReceivingResources, poLine.id, showCallout],
  );

  const deletePiece = useCallback((piece, options = {}) => {
    const apiCall = piece?.id
      ? mutatePiece({
        piece,
        options: {
          ...options,
          method: 'delete',
        },
      })
      : Promise.resolve();

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
  }, [fetchReceivingResources, poLine.id, showCallout, mutatePiece]);

  const onUnreceive = useCallback((pieces) => {
    return unreceive(pieces)
      .then(async () => {
        await fetchReceivingResources(poLine.id);
        showCallout({
          messageId: 'ui-receiving.title.actions.unreceive.success',
          type: 'success',
        });
      })
      .catch(async (error) => handleUnrecieveErrorResponse({ error, showCallout, receivedItems: pieces }));
  }, [fetchReceivingResources, poLine.id, showCallout, unreceive]);

  const isDataLoading = (
    isLoading
    || !(locations || vendorsMap)
    // TODO: resolve
    // || isLocationsLoading
    || !tenantId
  );

  if (isDataLoading) {
    return (
      <LoadingPane
        id="pane-title-details"
        onClose={onClose}
      />
    );
  }

  return (
    <TitleDetails
      crossTenant={isCentralOrderingEnabled}
      deletePiece={deletePiece}
      locations={locations}
      onAddPiece={onAddPiece}
      onCheckIn={onCheckIn}
      onClose={onClose}
      onEdit={onEdit}
      order={order}
      piecesExistance={piecesExistance}
      poLine={poLine}
      title={title}
      vendorsMap={vendorsMap}
      getHoldingsItemsAndPieces={getHoldingsItemsAndPieces}
      getPieceValues={getPieceById(mutator.orderPieces)}
      onUnreceive={onUnreceive}
    />
  );
};

TitleDetailsContainer.manifest = Object.freeze({
  title: {
    ...titleResource,
    accumulate: true,
    fetch: false,
    tenant: '!{tenantId}',
  },
  poLine: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
    tenant: '!{tenantId}',
  },
  purchaseOrder: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
    tenant: '!{tenantId}',
  },
  orderPieces: {
    tenant: '!{tenantId}',
  },
  pieces: {
    ...piecesResource,
    tenant: '!{tenantId}',
  },
  items: {
    ...itemsResource,
    tenant: '!{tenantId}',
  },
  vendors: {
    ...organizationsManifest,
    fetch: false,
    accumulate: true,
    tenant: '!{tenantId}',
  },
});

TitleDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
  tenantId: PropTypes.string.isRequired,
};

export default withRouter(stripesConnect(TitleDetailsContainer));
