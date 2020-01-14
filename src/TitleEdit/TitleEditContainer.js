import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { PO_LINES_API } from '../common/constants';
import { titleResource } from '../common/resources';
import TitleEdit from './TitleEdit';

function TitleEditContainer({ history, location, match, mutator }) {
  const titleId = match.params.id;
  const [title, setTitle] = useState();
  const showCallout = useShowCallout();
  const [poLine, setPoLine] = useState();

  useEffect(() => {
    setTitle();
    mutator.editTitle.GET()
      .then(titleResponse => {
        setTitle(titleResponse);

        return mutator.editTitlePOLine.GET({
          path: `${PO_LINES_API}/${titleResponse.poLineId}`,
        });
      })
      .then(setPoLine)
      .catch(() => showCallout({ messageId: 'ui-receiving.title.actions.load.error', type: 'error' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleId]);

  const onCancel = useCallback(
    () => history.push({
      pathname: `/receiving/${titleId}/view`,
      search: location.search,
    }),
    [history, titleId, location.search],
  );
  const onSubmit = useCallback(
    // eslint-disable-next-line no-unused-vars
    ({ poLineNumber, ...newTitle }) => {
      return mutator.editTitle.PUT(newTitle)
        .then(() => {
          showCallout({
            messageId: 'ui-receiving.title.actions.save.success',
            type: 'success',
            values: {
              title: newTitle.title,
              poLineNumber,
            },
          });
          setTimeout(onCancel);
        })
        .catch(() => showCallout({
          messageId: 'ui-receiving.title.actions.save.error',
          type: 'error',
          values: {
            title: newTitle.title,
            poLineNumber,
          },
        }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onCancel, titleId],
  );

  if (!title || !poLine) {
    return null;
  }

  const initialValues = {
    ...title,
    poLineNumber: poLine.poLineNumber,
  };

  return (
    <TitleEdit
      initialValues={initialValues}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  );
}

TitleEditContainer.manifest = Object.freeze({
  editTitle: {
    ...titleResource,
    accumulate: true,
    fetch: false,
  },
  editTitlePOLine: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
});

TitleEditContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(TitleEditContainer);
