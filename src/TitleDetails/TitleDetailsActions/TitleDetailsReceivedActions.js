import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  CheckboxFilter,
  ColumnManagerMenu,
} from '@folio/stripes/smart-components';
import { FilterMenu } from '@folio/stripes-acq-components';
import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
  MenuSection,
} from '@folio/stripes/components';

import {
  BOUND_MENU_FILTER_OPTIONS,
  MENU_FILTERS,
  RECEIVED_PIECE_COLUMN_MAPPING,
  SUPPLEMENT_MENU_FILTER_OPTIONS,
} from '../constants';

export function TitleDetailsReceivedActions({
  applyFilters,
  disabled,
  isBindPiecesButtonDisabled = false,
  filters,
  hasUnreceive,
  titleId,
  toggleColumn,
  visibleColumns,
}) {
  const intl = useIntl();

  if (!hasUnreceive) return null;

  return (
    <Dropdown
      data-testid="received-pieces-action-dropdown"
      label={<FormattedMessage id="ui-receiving.button.actions" />}
      buttonProps={{ buttonStyle: 'primary' }}
      modifiers={{
        preventOverflow: { boundariesElement: 'scrollParent' },
      }}
    >
      <DropdownMenu>
        <MenuSection
          label={intl.formatMessage({ id: 'stripes-components.paneMenuActionsToggleLabel' })}
          id="received-pieces-menu-actions"
        >
          <Button
            data-test-title-unreceive-button
            to={`/receiving/unreceive/${titleId}`}
            buttonStyle="dropdownItem"
            disabled={disabled}
          >
            <Icon icon="cancel">
              <FormattedMessage id="ui-receiving.title.details.button.unreceive" />
            </Icon>
          </Button>
          <Button
            data-testid="bind-pieces-button"
            to={`/receiving/bind-piece/${titleId}`}
            buttonStyle="dropdownItem"
            disabled={isBindPiecesButtonDisabled}
          >
            <Icon icon="report">
              <FormattedMessage id="ui-receiving.title.details.button.bindPieces" />
            </Icon>
          </Button>
        </MenuSection>

        <FilterMenu prefix="received-pieces">
          <CheckboxFilter
            dataOptions={SUPPLEMENT_MENU_FILTER_OPTIONS}
            name={`received-${MENU_FILTERS.supplement}`}
            onChange={({ values }) => applyFilters(MENU_FILTERS.supplement, values)}
            selectedValues={filters[MENU_FILTERS.supplement]}
          />
          <CheckboxFilter
            dataOptions={BOUND_MENU_FILTER_OPTIONS}
            name={`received-${MENU_FILTERS.bound}`}
            onChange={({ values }) => applyFilters(MENU_FILTERS.bound, values)}
            selectedValues={filters[MENU_FILTERS.bound]}
          />
        </FilterMenu>

        <ColumnManagerMenu
          prefix="received-pieces"
          columnMapping={RECEIVED_PIECE_COLUMN_MAPPING}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
        />
      </DropdownMenu>
    </Dropdown>
  );
}

TitleDetailsReceivedActions.propTypes = {
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  filters: PropTypes.object.isRequired,
  hasUnreceive: PropTypes.bool.isRequired,
  isBindPiecesButtonDisabled: PropTypes.bool,
  titleId: PropTypes.string.isRequired,
  toggleColumn: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};
