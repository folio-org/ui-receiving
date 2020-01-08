import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  PaneMenu,
  Button,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

export const renderNewButton = () => {
  return (
    <IfPermission perm="ui-receiving.create">
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.addNew">
          {ariaLabel => (
            <Button
              id="clickable-new-title"
              aria-label={ariaLabel}
              to="/receiving/create"
              buttonStyle="primary"
              marginBottom0
            >
              <FormattedMessage id="stripes-smart-components.new" />
            </Button>
          )}
        </FormattedMessage>
      </PaneMenu>
    </IfPermission>
  );
};
