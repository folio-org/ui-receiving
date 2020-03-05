import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  getLocationOptions,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  PIECE_STATUS,
  PO_LINES_API,
} from '../common/constants';
import {
  checkInResource,
  itemsResource,
  locationsResource,
  pieceResource,
  requestsResource,
  titleResource,
} from '../common/resources';
import {
  checkInItems,
  getHydratedPieces,
} from '../common/utils';
import TitleReceive from './TitleReceive';
import OpenedRequestsModal from './OpenedRequestsModal';

function TitleReceiveContainer({ history, location, match, mutator }) {
  const showCallout = useShowCallout();
  const titleId = match.params.id;
  const [pieces, setPieces] = useState();
  const [title, setTitle] = useState();
  const [poLine, setPoLine] = useState();
  const [locationOptions, setLocationOptions] = useState();
  const poLineId = title?.poLineId;

  useEffect(
    () => {
      mutator.locations.GET()
        .then((locationsResponse) => {
          setLocationOptions(getLocationOptions(locationsResponse));
        })
        .catch(() => setLocationOptions([]));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
            query: `poLineId==${poLineId} and receivingStatus==${PIECE_STATUS.expected} sortby locationId`,
          },
        })
          .then(piecesResponse => getHydratedPieces(piecesResponse, mutator.requests, mutator.items))
          .then(setPieces);
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
  const [receivedPiecesWithRequests, setReceivedPiecesWithRequests] = useState([]);
  const closeOpenedRequestsModal = useCallback(
    () => {
      setReceivedPiecesWithRequests([]);
      setTimeout(onCancel);
    },
    [onCancel],
  );
  const onSubmit = useCallback(
    // eslint-disable-next-line no-unused-vars
    ({ receivedItems }) => {
      return checkInItems(receivedItems, mutator.receive)
        .then(() => {
          showCallout({
            messageId: 'ui-receiving.title.actions.receive.success',
            type: 'success',
          });
          const receivedItemsWithRequests = receivedItems.filter(({ request }) => Boolean(request));

          if (receivedItemsWithRequests.length) {
            setReceivedPiecesWithRequests(receivedItemsWithRequests);
          } else {
            setTimeout(onCancel);
          }
        })
        .catch(() => {
          showCallout({ messageId: 'ui-receiving.title.actions.receive.error', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onCancel, poLine],
  );

  if (!(pieces && poLine && title && locationOptions)) return null;
  const initialValues = { receivedItems: pieces };
  const paneTitle = `${poLine.poLineNumber} - ${title.title}`;

  return (
    <>
      <TitleReceive
        initialValues={initialValues}
        locationOptions={locationOptions}
        onCancel={onCancel}
        onSubmit={onSubmit}
        paneTitle={paneTitle}
      />
      {receivedPiecesWithRequests.length && (
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
  },
  pieces: pieceResource,
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
  receive: checkInResource,
});

TitleReceiveContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(TitleReceiveContainer);
