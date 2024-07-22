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
  CENTRAL_RECEIVING_BIND_PIECES_BASE_ROUTE,
  CENTRAL_RECEIVING_ROUTE,
  RECEIVING_BIND_PIECES_BASE_ROUTE,
  RECEIVING_ROUTE,
} from '../../constants';
import { useReceivingSearchContext } from '../../contexts';
import {
  BOUND_MENU_FILTER_OPTIONS,
  MENU_FILTERS,
  RECEIVED_PIECE_COLUMN_MAPPING,
  SUPPLEMENT_MENU_FILTER_OPTIONS,
} from '../../Piece';

export function TitleDetailsReceivedActions({
  applyFilters,
  disabled,
  isBindPiecesButtonVisible = true,
  filters,
  hasUnreceive,
  titleId,
  toggleColumn,
  visibleColumns,
}) {
  const intl = useIntl();
  const { isCentralRouting } = useReceivingSearchContext();

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
            to={`${isCentralRouting ? CENTRAL_RECEIVING_ROUTE : RECEIVING_ROUTE}/unreceive/${titleId}`}
            buttonStyle="dropdownItem"
            disabled={disabled}
          >
            <Icon icon="cancel">
              <FormattedMessage id="ui-receiving.title.details.button.unreceive" />
            </Icon>
          </Button>
          {
            isBindPiecesButtonVisible && (
              <Button
                data-testid="bind-pieces-button"
                to={`${isCentralRouting ? CENTRAL_RECEIVING_BIND_PIECES_BASE_ROUTE : RECEIVING_BIND_PIECES_BASE_ROUTE}/${titleId}`}
                buttonStyle="dropdownItem"
              >
                <Icon icon="report">
                  <FormattedMessage id="ui-receiving.title.details.button.bindPieces" />
                </Icon>
              </Button>
            )
          }
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
  isBindPiecesButtonVisible: PropTypes.bool,
  titleId: PropTypes.string.isRequired,
  toggleColumn: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};
