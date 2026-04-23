import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import { ColumnManagerMenu } from '@folio/stripes/smart-components';

import {
  CENTRAL_RECEIVING_ROUTE_CREATE,
  RECEIVING_ROUTE_CREATE,
} from '../constants';
import { useReceivingSearchContext } from '../contexts';
import {
  RECEIVING_COLUMN_MANAGER_ID,
  RECEIVING_COLUMN_MAPPING,
  RECEIVING_MANDATORY_COLUMNS,
} from './constants';

export const ReceivingListActionMenu = ({
  onToggle,
  titlesCount,
  toggleExportModal,
  toggleColumn,
  visibleColumns,
}) => {
  const location = useLocation();
  const { isCentralRouting } = useReceivingSearchContext();

  return (
    <>
      <MenuSection id="receiving-list-actions">
        <IfPermission perm="ui-receiving.create">
          <FormattedMessage id="stripes-smart-components.addNew">
            {ariaLabel => (
              <Button
                id="clickable-new-title"
                aria-label={ariaLabel}
                buttonStyle="dropdownItem"
                to={{
                  pathname: isCentralRouting ? CENTRAL_RECEIVING_ROUTE_CREATE : RECEIVING_ROUTE_CREATE,
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

      <ColumnManagerMenu
        prefix={RECEIVING_COLUMN_MANAGER_ID}
        columnMapping={RECEIVING_COLUMN_MAPPING}
        excludeColumns={RECEIVING_MANDATORY_COLUMNS}
        visibleColumns={visibleColumns}
        toggleColumn={toggleColumn}
      />
    </>
  );
};

ReceivingListActionMenu.propTypes = {
  onToggle: PropTypes.func.isRequired,
  titlesCount: PropTypes.number.isRequired,
  toggleColumn: PropTypes.func.isRequired,
  toggleExportModal: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};
