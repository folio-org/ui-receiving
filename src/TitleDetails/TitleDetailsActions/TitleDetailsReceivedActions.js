import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
} from '@folio/stripes/components';

export function TitleDetailsReceivedActions({ titleId, hasUnreceive }) {
  return (
    <>
      {hasUnreceive && (
        <Button
          data-test-title-unreceive-button
          to={`/receiving/unreceive/${titleId}`}
        >
          <FormattedMessage id="ui-receiving.title.details.button.unreceive" />
        </Button>
      )}
    </>
  );
}

TitleDetailsReceivedActions.propTypes = {
  hasUnreceive: PropTypes.bool.isRequired,
  titleId: PropTypes.string.isRequired,
};
