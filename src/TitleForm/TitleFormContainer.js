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
  contributorNameTypesManifest,
  ERROR_CODE_GENERIC,
  getErrorCodeFromResponse,
  identifierTypesManifest,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { titlesResource } from '../common/resources';
import {
  CENTRAL_RECEIVING_ROUTE,
  RECEIVING_ROUTE,
} from '../constants';
import { useReceivingSearchContext } from '../contexts';
import TitleForm from './TitleForm';

function TitleFormContainer({
  history,
  location,
  match,
  mutator,
  tenantId,
}) {
  const titleId = match.params.id;
  const [identifierTypes, setIdentifierTypes] = useState();
  const [contributorNameTypes, setContributorNameTypes] = useState();
  const showCallout = useShowCallout();
  const intl = useIntl();

  const { isCentralRouting } = useReceivingSearchContext();

  useEffect(() => {
    mutator.identifierTypes.GET()
      .then(setIdentifierTypes)
      .catch(() => setIdentifierTypes([]));
    mutator.contributorNameTypes.GET()
      .then(setContributorNameTypes)
      .catch(() => setContributorNameTypes([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCancel = useCallback(
    () => history.push({
      pathname: isCentralRouting ? CENTRAL_RECEIVING_ROUTE : RECEIVING_ROUTE,
      search: location.search,
    }),
    [history, isCentralRouting, location.search],
  );
  const onSubmit = useCallback(
    ({ poLine, ...newTitle }) => {
      return mutator.titles.POST(newTitle)
        .then(({ id }) => {
          showCallout({
            messageId: 'ui-receiving.title.actions.save.success',
            type: 'success',
            values: {
              title: newTitle.title,
              poLineNumber: poLine.poLineNumber,
            },
          });

          history.push({
            pathname: `${isCentralRouting ? CENTRAL_RECEIVING_ROUTE : RECEIVING_ROUTE}/${id}/view`,
            search: location.search,
          });
        })
        .catch(async (response) => {
          const errorCode = await getErrorCodeFromResponse(response);
          const values = {
            title: <b>{newTitle.title}</b>,
            poLineNumber: <b>{poLine.poLineNumber}</b>,
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
    [history, isCentralRouting, showCallout, titleId, location.search, intl],
  );

  if (!identifierTypes || !contributorNameTypes) {
    return (
      <Paneset>
        <LoadingPane />
      </Paneset>
    );
  }

  return (
    <TitleForm
      contributorNameTypes={contributorNameTypes}
      identifierTypes={identifierTypes}
      initialValues={{}}
      onCancel={onCancel}
      onSubmit={onSubmit}
      tenantId={tenantId}
    />
  );
}

TitleFormContainer.manifest = Object.freeze({
  contributorNameTypes: {
    ...contributorNameTypesManifest,
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
  titles: {
    ...titlesResource,
    accumulate: true,
    fetch: false,
    tenant: '!{tenantId}',
  },
});

TitleFormContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  tenantId: PropTypes.string.isRequired,
};

export default stripesConnect(TitleFormContainer);
