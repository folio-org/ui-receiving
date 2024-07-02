import { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  LoadingPane,
  PaneHeader,
  Paneset,
} from '@folio/stripes/components';
import {
  PIECE_STATUS,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  usePiecesExpect,
  useTitleHydratedPieces,
} from '../common/hooks';
import {
  CENTRAL_RECEIVING_ROUTE,
  RECEIVING_ROUTE,
} from '../constants';
import { useReceivingSearchContext } from '../contexts';
import TitleExpect from './TitleExpect';

export function TitleExpectContainer({ history, location, match }) {
  const titleId = match.params.id;
  const showCallout = useShowCallout();
  const {
    isCentralRouting,
    targetTenantId,
  } = useReceivingSearchContext();

  const { expectPieces } = usePiecesExpect({ tenantId: targetTenantId });
  const {
    isLoading,
    orderLine,
    pieceHoldingMap,
    pieceLocationMap,
    pieces,
    title,
  } = useTitleHydratedPieces({
    tenantId: targetTenantId,
    titleId,
    receivingStatus: PIECE_STATUS.unreceivable,
  });

  const onCancel = useCallback(() => {
    history.push({
      pathname: `${isCentralRouting ? CENTRAL_RECEIVING_ROUTE : RECEIVING_ROUTE}/${titleId}/view`,
      search: location.search,
    });
  }, [history, isCentralRouting, titleId, location.search]);

  const onSubmit = useCallback(({ unreceivablePieces }) => {
    return expectPieces(unreceivablePieces)
      .then(() => {
        showCallout({ messageId: 'ui-receiving.title.actions.expect.success' });

        onCancel();
      })
      .catch(() => {
        showCallout({
          messageId: 'ui-receiving.title.actions.expect.error',
          type: 'error',
        });
      });
  }, [expectPieces, onCancel, showCallout]);

  if (isLoading) {
    return (
      <Paneset>
        <LoadingPane
          renderHeader={renderProps => (
            <PaneHeader
              {...renderProps}
              dismissible
              onClose={onCancel}
            />
          )}
        />
      </Paneset>
    );
  }

  const initialValues = { unreceivablePieces: pieces };
  const paneTitle = `${orderLine.poLineNumber} - ${title.title}`;

  return (
    <TitleExpect
      initialValues={initialValues}
      onCancel={onCancel}
      onSubmit={onSubmit}
      paneTitle={paneTitle}
      pieceLocationMap={pieceLocationMap}
      pieceHoldingMap={pieceHoldingMap}
    />
  );
}

TitleExpectContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};
