import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  Dropdown,
  DropdownMenu,
  MenuSection,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';
import { FilterMenu } from '@folio/stripes-acq-components';

import {
  MENU_FILTERS,
  SUPPLEMENT_MENU_FILTER_OPTIONS,
} from '../constants';

export function TitleDetailsUnreceivableActions({
  applyFilters,
  disabled,
  filters,
  hasRecords,
  titleId,
  renderColumnsMenu,
}) {
  const intl = useIntl();

  if (!hasRecords) return null;

  return (
    <Dropdown
      data-testid="unreceivable-pieces-action-dropdown"
      label={<FormattedMessage id="ui-receiving.button.actions" />}
      buttonProps={{ buttonStyle: 'primary' }}
      modifiers={{
        preventOverflow: { boundariesElement: 'scrollParent' },
      }}
    >
      <DropdownMenu>
        <MenuSection
          label={intl.formatMessage({ id: 'stripes-components.paneMenuActionsToggleLabel' })}
          id="unreceivable-pieces-menu-actions"
        >
          <Button
            to={`/receiving/expect/${titleId}`}
            buttonStyle="dropdownItem"
            disabled={disabled}
          >
            <FormattedMessage id="ui-receiving.title.details.button.expect" />
          </Button>
        </MenuSection>

        <FilterMenu prefix="unreceivable-pieces">
          <CheckboxFilter
            dataOptions={SUPPLEMENT_MENU_FILTER_OPTIONS}
            name={`unreceivable-${MENU_FILTERS.supplement}`}
            onChange={({ values }) => applyFilters(MENU_FILTERS.supplement, values)}
            selectedValues={filters[MENU_FILTERS.supplement]}
          />
        </FilterMenu>

        {renderColumnsMenu}
      </DropdownMenu>
    </Dropdown>
  );
}

TitleDetailsUnreceivableActions.propTypes = {
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  filters: PropTypes.object.isRequired,
  hasRecords: PropTypes.bool.isRequired,
  titleId: PropTypes.string.isRequired,
  renderColumnsMenu: PropTypes.func.isRequired,
};
