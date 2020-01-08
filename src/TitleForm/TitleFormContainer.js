import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';

import {
  identifierTypesResource,
  titlesResource,
} from '../common/resources';
import TitleForm from './TitleForm';

function TitleFormContainer({ history, match, mutator }) {
  const titleId = match.params.id;
  const [identifierTypes, setIdentifierTypes] = useState();

  useEffect(() => {
    mutator.identifierTypes.GET()
      .then(setIdentifierTypes)
      .catch(() => setIdentifierTypes([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleId]);

  const onCancel = useCallback(
    () => history.push('/receiving'),
    [],
  );
  const onSubmit = useCallback(
    ({ poLineNumber, ...newTitle }) => {
      return mutator.titles.POST(newTitle)
        .then(savedTitle => {
          setTimeout(() => history.push('/receiving'));
        });
    },
    [history, titleId],
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
    ...identifierTypesResource,
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
