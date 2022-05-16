import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

export const ReceivingListActionMenu = ({
  onToggle,
  titlesCount,
  toggleExportModal,
}) => {
  const location = useLocation();

  return (
    <MenuSection id="receiving-list-actions">
      <IfPermission perm="ui-receiving.create">
        <FormattedMessage id="stripes-smart-components.addNew">
          {ariaLabel => (
            <Button
              id="clickable-new-title"
              aria-label={ariaLabel}
              buttonStyle="dropdownItem"
              to={{
                pathname: '/receiving/create',
                search: location.search,
              }}
              marginBottom0
            >
              <Icon size="small" icon="plus-sign">
                <FormattedMessage id="stripes-smart-components.new" />
              </Icon>
            </Button>
          )}
        </FormattedMessage>
      </IfPermission>

      <IfPermission perm="ui-receiving.exportCSV">
        <FormattedMessage id="ui-receiving.title.actions.exportCSV">
          {ariaLabel => (
            <Button
              aria-label={ariaLabel}
              data-testid="export-csv-button"
              id="clickable-export-csv"
              buttonStyle="dropdownItem"
              onClick={() => {
                onToggle();
                toggleExportModal();
              }}
              disabled={!titlesCount}
            >
              <Icon size="small" icon="download">
                <FormattedMessage id="ui-receiving.title.actions.exportCSV" />
              </Icon>
            </Button>
          )}
        </FormattedMessage>
      </IfPermission>
    </MenuSection>
  );
};

ReceivingListActionMenu.propTypes = {
  onToggle: PropTypes.func.isRequired,
  titlesCount: PropTypes.number.isRequired,
  toggleExportModal: PropTypes.func.isRequired,
};
