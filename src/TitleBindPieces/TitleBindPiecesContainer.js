import { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  LoadingPane,
  Paneset,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import {
  usePOLine,
  useTitle,
} from '../common/hooks';

import { useUnboundPieces } from './hooks';
import TitleBindPieces from './TitleBindPieces';

function TitleBindPiecesContainer({ history, location, match }) {
  const titleId = match.params.id;

  const { title, isLoading: isTitleLoading } = useTitle(titleId);
  const { poLine, isLoading: isPOLineLoading } = usePOLine(title?.poLineId);
  const { isLoading: isUnboundPiecesLoading, unboundPieces } = useUnboundPieces(titleId, title?.poLineId);

  const onCancel = useCallback(
    () => {
      history.push({
        pathname: `/receiving/${titleId}/view`,
        search: location.search,
      });
    },
    [history, titleId, location.search],
  );
  const onSubmit = () => {};

  if (isUnboundPiecesLoading || isTitleLoading || isPOLineLoading) {
    return (
      <Paneset>
        <LoadingPane />
      </Paneset>
    );
  }

  const initialValues = { receivedItems: unboundPieces };
  const paneTitle = `${poLine?.poLineNumber} - ${title?.title}`;

  return (
    <TitleBindPieces
      initialValues={initialValues}
      onCancel={onCancel}
      onSubmit={onSubmit}
      paneTitle={paneTitle}
    />
  );
}

TitleBindPiecesContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default stripesConnect(TitleBindPiecesContainer);
