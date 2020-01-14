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
import { titleResource } from '../common/resources';
import TitleDetails from './TitleDetails';

const TitleDetailsContainer = ({ location, history, mutator, match }) => {
  const titleId = match.params.id;
  const showCallout = useShowCallout();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState({});
  const [poLine, setPoLine] = useState({});

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
        .then(response => setPoLine(response))
        .catch(() => {
          showCallout({ messageId: 'ui-receiving.title.actions.load.error', type: 'error' });
        })
        .finally(() => {
          setIsLoading(false);
        });
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

  if (isLoading) {
    return (<LoadingPane onClose={onClose} />);
  }

  return (
    <TitleDetails
      onClose={onClose}
      title={title}
      poLine={poLine}
      onEdit={onEdit}
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
});

TitleDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(TitleDetailsContainer));
