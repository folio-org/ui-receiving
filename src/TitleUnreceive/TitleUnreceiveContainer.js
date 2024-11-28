import PropTypes from 'prop-types';
import {
  useCallback,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  stripesConnect,
} from '@folio/stripes/core';
import {
  LoadingPane,
  Paneset,
} from '@folio/stripes/components';
import {
  PIECE_STATUS,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { receivingResource } from '../common/resources';
import {
  handleUnrecieveErrorResponse,
  unreceivePieces,
} from '../common/utils';
import {
  CENTRAL_RECEIVING_ROUTE,
  RECEIVING_ROUTE,
} from '../constants';
import { useTitleHydratedPieces } from '../common/hooks';
import { useReceivingSearchContext } from '../contexts';
import TitleUnreceive from './TitleUnreceive';

function TitleUnreceiveContainer({
  history,
  location,
  match,
  mutator,
}) {
  const showCallout = useShowCallout();
  const titleId = match.params.id;

  const {
    isCentralRouting,
    targetTenantId,
  } = useReceivingSearchContext();

  const {
    pieces = [],
    title,
    orderLine: poLine,
    isLoading: isPiecesLoading,
    pieceHoldingMap,
    pieceLocationMap,
  } = useTitleHydratedPieces({
    titleId,
    tenantId: targetTenantId,
    receivingStatus: PIECE_STATUS.received,
  });

  const onCancel = useCallback(
    () => {
      history.push({
        pathname: `${isCentralRouting ? CENTRAL_RECEIVING_ROUTE : RECEIVING_ROUTE}/${titleId}/view`,
        search: location.search,
      });
    },
    [history, isCentralRouting, titleId, location.search],
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
        .catch(async (error) => handleUnrecieveErrorResponse({ error, showCallout, receivedItems }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onCancel, showCallout],
  );

  if (isPiecesLoading || !title || !poLine) {
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
  unreceive: {
    ...receivingResource,
    tenant: '!{tenantId}',
  },
});

TitleUnreceiveContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(TitleUnreceiveContainer);
