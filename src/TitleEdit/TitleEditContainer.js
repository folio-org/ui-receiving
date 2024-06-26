import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  LoadingPane,
  Paneset,
} from '@folio/stripes/components';
import {
  baseManifest,
  contributorNameTypesManifest,
  ERROR_CODE_GENERIC,
  getErrorCodeFromResponse,
  identifierTypesManifest,
  LINES_API,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { titleResource } from '../common/resources';
import TitleForm from '../TitleForm/TitleForm';

function TitleEditContainer({
  history,
  location,
  match,
  mutator,
  tenantId,
}) {
  const titleId = match.params.id;
  const [title, setTitle] = useState();
  const showCallout = useShowCallout();
  const [poLine, setPoLine] = useState();
  const [identifierTypes, setIdentifierTypes] = useState();
  const [contributorNameTypes, setContributorNameTypes] = useState();
  const intl = useIntl();

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
          path: `${LINES_API}/${titleResponse.poLineId}`,
        });
      })
      .then(setPoLine)
      .catch(() => showCallout({ messageId: 'ui-receiving.title.actions.load.error', type: 'error' }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleId]);

  const onCancel = useCallback(
    () => {
      const pathname = location.state?.backPathname || `/receiving/${titleId}/view`;

      history.push({
        pathname,
        search: location.search,
      });
    },
    [history, titleId, location.search, location.state],
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

          onCancel();
        })
        .catch(async (response) => {
          const errorCode = await getErrorCodeFromResponse(response);
          const values = {
            title: <b>{newTitle.title}</b>,
            poLineNumber: <b>{line.poLineNumber}</b>,
          };
          const message = (
            <FormattedMessage
              id={`ui-receiving.title.actions.save.error.${errorCode}`}
              defaultMessage={intl.formatMessage({ id: `ui-receiving.title.actions.save.error.${ERROR_CODE_GENERIC}` }, values)}
              values={values}
            />
          );

          showCallout({
            message,
            type: 'error',
          });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showCallout, onCancel, intl],
  );

  if (!(title && poLine && identifierTypes && contributorNameTypes)) {
    return (
      <Paneset>
        <LoadingPane />
      </Paneset>
    );
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
      tenantId={tenantId}
    />
  );
}

TitleEditContainer.manifest = Object.freeze({
  contributorNameTypes: {
    ...contributorNameTypesManifest,
    accumulate: true,
    fetch: false,
    tenant: '!{tenantId}',
  },
  editTitle: {
    ...titleResource,
    accumulate: true,
    fetch: false,
    tenant: '!{tenantId}',
  },
  editTitlePOLine: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
    tenant: '!{tenantId}',
  },
  identifierTypes: {
    ...identifierTypesManifest,
    accumulate: true,
    fetch: false,
    tenant: '!{tenantId}',
  },
});

TitleEditContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  tenantId: PropTypes.string.isRequired,
};

export default stripesConnect(TitleEditContainer);
