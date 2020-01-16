import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import {
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
  titleResource,
} from '../common/resources';
import TitleDetails from './TitleDetails';
import { checkInItems } from './utils';

const TitleDetailsContainer = ({ location, history, mutator, match }) => {
  const titleId = match.params.id;
  const showCallout = useShowCallout();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState({});
  const [poLine, setPoLine] = useState({});
  const [pieces, setPieces] = useState();
  const [locations, setLocations] = useState();

  const fetchPieces = useCallback(
    (lineId) => {
      setPieces();

      mutator.pieces.GET({
        params: {
          query: `poLineId==${lineId} sortby receiptDate`,
        },
      })
        .then(setPieces)
        .catch(() => setPieces([]));
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

          return fetchPieces(line.id);
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

      mutator.orderPieces[mutatorMethod](values)
        .then(() => showCallout({
          messageId: 'ui-receiving.piece.actions.addPiece.success',
          type: 'success',
          values: { title: title.title },
        }))
        .catch(() => showCallout({ messageId: 'ui-receiving.piece.actions.addPiece.error', type: 'error' }))
        .finally(() => fetchPieces(poLine.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchPieces, title.title],
  );

  const onCheckIn = useCallback(
    (values) => {
      const mutatorMethod = values.id ? 'PUT' : 'POST';

      mutator.orderPieces[mutatorMethod](values)
        .then(piece => {
          showCallout({
            messageId: 'ui-receiving.piece.actions.addPiece.success',
            type: 'success',
            values: { title: title.title },
          });

          return checkInItems([{
            ...piece,
            itemStatus: ITEM_STATUS.inProcess,
          }], mutator.checkIn);
        })
        .catch(() => showCallout({ messageId: 'ui-receiving.piece.actions.checkInItem.error', type: 'error' }))
        .finally(() => fetchPieces(poLine.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchPieces, title.title],
  );

  if (isLoading || !locations || !pieces) {
    return (<LoadingPane onClose={onClose} />);
  }

  return (
    <TitleDetails
      locations={locations}
      onAddPiece={onAddPiece}
      onCheckIn={onCheckIn}
      onClose={onClose}
      onEdit={onEdit}
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
  orderPieces: orderPiecesResource,
  pieces: pieceResource,
  locations: {
    ...locationsResource,
    fetch: false,
  },
  checkIn: checkInResource,
});

TitleDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(TitleDetailsContainer));
