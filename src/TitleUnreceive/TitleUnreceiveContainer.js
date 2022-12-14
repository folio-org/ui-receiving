import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  LoadingPane,
  Paneset,
} from '@folio/stripes/components';
import {
  baseManifest,
  batchFetch,
  itemsResource,
  LIMIT_MAX,
  LINES_API,
  locationsManifest,
  PIECE_STATUS,
  piecesResource,
  requestsResource,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  receivingResource,
  titleResource,
  holdingsResource,
} from '../common/resources';
import {
  getHydratedPieces,
  unreceivePieces,
} from '../common/utils';
import TitleUnreceive from './TitleUnreceive';

function TitleUnreceiveContainer({ history, location, match, mutator }) {
  const showCallout = useShowCallout();
  const titleId = match.params.id;
  const [pieces, setPieces] = useState();
  const [title, setTitle] = useState();
  const [poLine, setPoLine] = useState();
  const [pieceLocationMap, setPieceLocationMap] = useState();
  const [pieceHoldingMap, setPieceHoldingMap] = useState();
  const poLineId = title?.poLineId;

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
        const filterQuery = `titleId=${titleId} and poLineId==${poLineId} and receivingStatus==${PIECE_STATUS.received}`;

        mutator.pieces.GET({
          params: {
            limit: `${LIMIT_MAX}`,
            query: `${filterQuery} sortby locationId`,
          },
        })
          .then(piecesResponse => getHydratedPieces(piecesResponse, mutator.requests, mutator.items))
          .then(hydratedPieces => {
            setPieces(hydratedPieces);
            const holdingIds = hydratedPieces.map(({ holdingId }) => holdingId).filter(Boolean);
            const locationIds = hydratedPieces.map(({ locationId }) => locationId).filter(Boolean);
            const holdingsPromise = holdingIds.length ? batchFetch(mutator.holdings, holdingIds) : Promise.resolve([]);

            return Promise.all([holdingsPromise, locationIds]);
          })
          .then(([holdingsResponse, locationIds]) => {
            setPieceHoldingMap(holdingsResponse.reduce((acc, h) => ({ ...acc, [h.id]: h }), {}));

            const holdingLocations = holdingsResponse.map(({ permanentLocationId }) => permanentLocationId);

            return batchFetch(mutator.locations, [...new Set([...holdingLocations, ...locationIds])]);
          })
          .then(locationsResponse => {
            setPieceLocationMap(locationsResponse.reduce((acc, l) => ({ ...acc, [l.id]: l }), {}));
          })
          .catch(() => {
            setPieceHoldingMap({});
            setPieceLocationMap({});
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [titleId, poLineId],
  );

  const onCancel = useCallback(
    () => {
      history.push({
        pathname: `/receiving/${titleId}/view`,
        search: location.search,
      });
    },
    [history, titleId, location.search],
  );
  const onSubmit = useCallback(
    // eslint-disable-next-line no-unused-vars
    ({ receivedItems }) => {
      return unreceivePieces(receivedItems, mutator.unreceive)
        .then(() => {
          showCallout({
            messageId: 'ui-receiving.title.actions.unreceive.success',
            type: 'success',
          });

          onCancel();
        })
        .catch(() => {
          showCallout({ messageId: 'ui-receiving.title.actions.unreceive.error', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onCancel, showCallout],
  );

  if (!(pieces && poLine && title && pieceLocationMap && pieceHoldingMap)) {
    return (
      <Paneset>
        <LoadingPane />
      </Paneset>
    );
  }

  const initialValues = { receivedItems: pieces };
  const paneTitle = `${poLine.poLineNumber} - ${title.title}`;

  return (
    <TitleUnreceive
      initialValues={initialValues}
      onCancel={onCancel}
      onSubmit={onSubmit}
      paneTitle={paneTitle}
      pieceLocationMap={pieceLocationMap}
      pieceHoldingMap={pieceHoldingMap}
    />
  );
}

TitleUnreceiveContainer.manifest = Object.freeze({
  title: {
    ...titleResource,
    accumulate: true,
    fetch: false,
  },
  pieces: piecesResource,
  poLine: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
  items: itemsResource,
  requests: requestsResource,
  locations: {
    ...locationsManifest,
    fetch: false,
  },
  holdings: {
    ...holdingsResource,
    fetch: false,
  },
  unreceive: receivingResource,
});

TitleUnreceiveContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(TitleUnreceiveContainer);
