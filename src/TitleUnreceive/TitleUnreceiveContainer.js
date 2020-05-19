import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  batchFetch,
  itemsResource,
  PIECE_STATUS,
  piecesResource,
  requestsResource,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  PO_LINES_API,
} from '../common/constants';
import {
  receivingResource,
  locationsResource,
  titleResource,
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
          path: `${PO_LINES_API}/${poLineId}`,
        }).then(setPoLine);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [poLineId],
  );

  useEffect(
    () => {
      if (poLineId) {
        mutator.pieces.GET({
          params: {
            query: `poLineId==${poLineId} and receivingStatus==${PIECE_STATUS.received} sortby locationId`,
          },
        })
          .then(piecesResponse => getHydratedPieces(piecesResponse, mutator.requests, mutator.items))
          .then(hydratedPieces => {
            setPieces(hydratedPieces);
            const locationIds = hydratedPieces.map(({ locationId }) => locationId);

            return batchFetch(mutator.locations, locationIds);
          })
          .then((locationsResponse) => {
            setPieceLocationMap(locationsResponse.reduce(
              (acc, { code, id, name }) => {
                acc[id] = `${name} (${code})`;

                return acc;
              },
              {},
            ));
          })
          .catch(() => setPieceLocationMap({}));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [poLineId],
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
          setTimeout(onCancel);
        })
        .catch(() => {
          showCallout({ messageId: 'ui-receiving.title.actions.unreceive.error', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onCancel, poLine],
  );

  if (!(pieces && poLine && title && pieceLocationMap)) return null;
  const initialValues = { receivedItems: pieces };
  const paneTitle = `${poLine.poLineNumber} - ${title.title}`;

  return (
    <TitleUnreceive
      initialValues={initialValues}
      onCancel={onCancel}
      onSubmit={onSubmit}
      paneTitle={paneTitle}
      pieceLocationMap={pieceLocationMap}
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
    ...locationsResource,
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
