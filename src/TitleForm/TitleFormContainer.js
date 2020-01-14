import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  identifierTypesManifest,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { titlesResource } from '../common/resources';
import TitleForm from './TitleForm';

function TitleFormContainer({ history, match, mutator }) {
  const titleId = match.params.id;
  const [identifierTypes, setIdentifierTypes] = useState();
  const showCallout = useShowCallout();

  useEffect(() => {
    mutator.identifierTypes.GET()
      .then(setIdentifierTypes)
      .catch(() => setIdentifierTypes([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleId]);

  const onCancel = useCallback(
    () => history.push('/receiving'),
    [history],
  );
  const onSubmit = useCallback(
    ({ poLineNumber, ...newTitle }) => {
      return mutator.titles.POST(newTitle)
        .then(() => {
          showCallout({
            messageId: 'ui-receiving.title.actions.save.success',
            type: 'success',
            values: {
              title: newTitle.title,
              poLineNumber,
            },
          });
          setTimeout(() => history.push('/receiving'));
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
    [history, showCallout, titleId],
  );

  if (!identifierTypes) {
    return null;
  }

  return (
    <TitleForm
      identifierTypes={identifierTypes}
      initialValues={{}}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  );
}

TitleFormContainer.manifest = Object.freeze({
  identifierTypes: {
    ...identifierTypesManifest,
    accumulate: true,
    fetch: false,
  },
  titles: {
    ...titlesResource,
    accumulate: true,
    fetch: false,
  },
});

TitleFormContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(TitleFormContainer);
