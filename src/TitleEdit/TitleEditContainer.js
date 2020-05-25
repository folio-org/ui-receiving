import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  contributorNameTypesManifest,
  identifierTypesManifest,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { PO_LINES_API } from '../common/constants';
import { titleResource } from '../common/resources';
import { handleSaveTitleErrorResponse } from '../common/utils';
import TitleForm from '../TitleForm/TitleForm';

function TitleEditContainer({ history, location, match, mutator }) {
  const titleId = match.params.id;
  const [title, setTitle] = useState();
  const showCallout = useShowCallout();
  const [poLine, setPoLine] = useState();
  const [identifierTypes, setIdentifierTypes] = useState();
  const [contributorNameTypes, setContributorNameTypes] = useState();

  useEffect(() => {
    mutator.identifierTypes.GET()
      .then(setIdentifierTypes)
      .catch(() => setIdentifierTypes([]));
    mutator.contributorNameTypes.GET()
      .then(setContributorNameTypes)
      .catch(() => setContributorNameTypes([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    ({ poLine: line, ...newTitle }) => {
      return mutator.editTitle.PUT(newTitle)
        .then(() => {
          showCallout({
            messageId: 'ui-receiving.title.actions.save.success',
            type: 'success',
            values: {
              title: newTitle.title,
              poLineNumber: line.poLineNumber,
            },
          });
          setTimeout(onCancel);
        })
        .catch(async (response) => {
          const errorCode = await handleSaveTitleErrorResponse(response);

          showCallout({
            messageId: `ui-receiving.title.actions.save.error.${errorCode}`,
            type: 'error',
            values: {
              title: newTitle.title,
              poLineNumber: line.poLineNumber,
            },
          });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onCancel, titleId],
  );

  if (!(title && poLine && identifierTypes && contributorNameTypes)) {
    return null;
  }

  const initialValues = {
    ...title,
    poLine,
  };

  return (
    <TitleForm
      contributorNameTypes={contributorNameTypes}
      identifierTypes={identifierTypes}
      initialValues={initialValues}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  );
}

TitleEditContainer.manifest = Object.freeze({
  contributorNameTypes: {
    ...contributorNameTypesManifest,
    accumulate: true,
    fetch: false,
  },
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
  identifierTypes: {
    ...identifierTypesManifest,
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
