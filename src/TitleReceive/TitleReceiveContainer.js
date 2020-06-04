import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  configLoanTypeResource,
  itemsResource,
  LIMIT_MAX,
  LOAN_TYPES,
  PIECE_FORMAT,
  PIECE_STATUS,
  pieceResource,
  piecesResource,
  requestsResource,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  PO_LINES_API,
} from '../common/constants';
import {
  checkInResource,
  holdingsResource,
  titleResource,
} from '../common/resources';
import {
  checkIn,
  getHydratedPieces,
  ifMissingPermanentLoanTypeId,
} from '../common/utils';
import TitleReceive from './TitleReceive';
import OpenedRequestsModal from './OpenedRequestsModal';

function TitleReceiveContainer({ history, location, match, mutator, resources }) {
  const showCallout = useShowCallout();
  const titleId = match.params.id;
  const [pieces, setPieces] = useState();
  const [title, setTitle] = useState();
  const [poLine, setPoLine] = useState();
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
            limit: `${LIMIT_MAX}`,
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

  const [loanTypeId, setLoanTypeId] = useState();
  const configLoanTypeName = resources?.configLoanType?.records?.[0]?.value;

  useEffect(() => {
    if (configLoanTypeName) {
      mutator.loanTypes.GET({ params: {
        query: `name='${configLoanTypeName}'`,
      } })
        .then(loanTypes => {
          setLoanTypeId(loanTypes?.[0]?.id);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configLoanTypeName]);

  const onSubmit = useCallback(
    // eslint-disable-next-line no-unused-vars
    ({ receivedItems }) => {
      return checkIn(
        receivedItems.filter(({ checked }) => checked === true),
        mutator.piece,
        mutator.receive,
        mutator.holdings,
        mutator.items,
        title.instanceId,
        loanTypeId,
        poLine,
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
            setTimeout(onCancel);
          }
        }, async response => {
          const isMissingPermanentLoanTypeId = await ifMissingPermanentLoanTypeId(response);

          if (isMissingPermanentLoanTypeId) {
            showCallout({ messageId: 'ui-receiving.title.actions.missingLoanTypeId.error', type: 'error' });
          } else {
            showCallout({ messageId: 'ui-receiving.title.actions.receive.error', type: 'error' });
          }
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [title.instanceId, loanTypeId, poLine, showCallout, onCancel],
  );

  const createInventoryValues = useMemo(
    () => ({
      [PIECE_FORMAT.physical]: poLine?.physical?.createInventory,
      [PIECE_FORMAT.electronic]: poLine?.eresource?.createInventory,
      [PIECE_FORMAT.other]: poLine?.physical?.createInventory,
    }),
    [poLine],
  );

  if (!(pieces && poLine && title)) return null;
  const initialValues = { receivedItems: pieces };
  const paneTitle = `${poLine.poLineNumber} - ${title.title}`;

  return (
    <>
      <TitleReceive
        createInventoryValues={createInventoryValues}
        initialValues={initialValues}
        instanceId={title.instanceId}
        onCancel={onCancel}
        onSubmit={onSubmit}
        paneTitle={paneTitle}
        receivingNote={poLine?.details?.receivingNote}
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
  pieces: piecesResource,
  poLine: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
  items: itemsResource,
  requests: requestsResource,
  receive: checkInResource,
  holdings: holdingsResource,
  piece: pieceResource,
  configLoanType: configLoanTypeResource,
  loanTypes: {
    ...LOAN_TYPES,
    accumulate: true,
    fetch: false,
  },
});

TitleReceiveContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(TitleReceiveContainer);
