import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  configLoanTypeResource,
  itemsResource,
  LIMIT_MAX,
  LoadingPane,
  LOAN_TYPES,
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
  checkInResource,
  holdingsResource,
  titleResource,
} from '../common/resources';
import {
  getHydratedPieces,
  quickReceive,
  savePiece,
} from '../common/utils';
import TitleDetails from './TitleDetails';

const TitleDetailsContainer = ({ location, history, mutator, match, resources }) => {
  const titleId = match.params.id;
  const showCallout = useShowCallout();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState({});
  const [poLine, setPoLine] = useState({});
  const [pieces, setPieces] = useState();
  const [order, setOrder] = useState({});
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

  const fetchReceivingResources = useCallback(
    (lineId) => {
      setPieces();

      return mutator.pieces.GET({
        params: {
          limit: `${LIMIT_MAX}`,
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
    [],
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
    [fetchReceivingResources, showCallout, titleId],
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
      const actionType = values.id ? 'updatePiece' : 'addPiece';

      return savePiece(
        mutator.orderPieces,
        mutator.holdings,
        mutator.items,
        values,
        title.instanceId,
        loanTypeId,
        poLine,
      )
        .then(() => {
          showCallout({
            messageId: `ui-receiving.piece.actions.${actionType}.success`,
            type: 'success',
            values: { caption: values.caption },
          });
        }, async response => {
          let parsed;

          try {
            parsed = await response.json();
          // eslint-disable-next-line no-empty
          } catch (parsingException) {
          }
          const isMissingPermanentLoanTypeId = parsed?.errors?.some(({ parameters }) => parameters?.some(({ key }) => key === 'permanentLoanTypeId'));

          if (isMissingPermanentLoanTypeId) {
            showCallout({ messageId: 'ui-receiving.title.actions.missingLoanTypeId.error', type: 'error' });
          } else {
            showCallout({
              messageId: `ui-receiving.piece.actions.${actionType}.error`,
              type: 'error',
              values: { caption: values.caption },
            });
          }
        })
        .finally(() => fetchReceivingResources(poLine.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchReceivingResources, poLine, showCallout, title.instanceId, loanTypeId],
  );

  const onCheckIn = useCallback(
    (values) => {
      return quickReceive(
        mutator.checkIn,
        mutator.orderPieces,
        mutator.holdings,
        mutator.items,
        values,
        title.instanceId,
        loanTypeId,
        poLine,
      )
        .then(() => {
          if (!values.id) {
            showCallout({
              messageId: 'ui-receiving.piece.actions.addPiece.success',
              type: 'success',
              values: { caption: values.caption },
            });
          }
          showCallout({
            messageId: 'ui-receiving.piece.actions.checkInItem.success',
            type: 'success',
            values: { caption: values.caption },
          });
        }, async response => {
          let parsed;

          try {
            parsed = await response.json();
          // eslint-disable-next-line no-empty
          } catch (parsingException) {
          }

          const isMissingPermanentLoanTypeId = parsed?.errors?.some(({ parameters }) => parameters?.some(({ key }) => key === 'permanentLoanTypeId'));

          if (isMissingPermanentLoanTypeId) {
            showCallout({ messageId: 'ui-receiving.title.actions.missingLoanTypeId.error', type: 'error' });
          } else {
            showCallout({ messageId: 'ui-receiving.piece.actions.checkInItem.error', type: 'error' });
          }
        })
        .finally(() => fetchReceivingResources(poLine.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchReceivingResources, poLine, showCallout, title.instanceId, loanTypeId],
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
  orderPieces: pieceResource,
  pieces: piecesResource,
  checkIn: checkInResource,
  items: itemsResource,
  requests: requestsResource,
  holdings: holdingsResource,
  configLoanType: configLoanTypeResource,
  loanTypes: {
    ...LOAN_TYPES,
    accumulate: true,
    fetch: false,
  },
});

TitleDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(TitleDetailsContainer));
