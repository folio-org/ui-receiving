import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { FilterMenu } from '@folio/stripes-acq-components';
import { CheckboxFilter, ColumnManagerMenu } from '@folio/stripes/smart-components';
import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
  MenuSection,
} from '@folio/stripes/components';

import {
  EXPECTED_PIECE_COLUMN_MAPPING,
  MENU_FILTERS,
  SUPPLEMENT_MENU_FILTER_OPTIONS,
} from '../constants';

export function TitleDetailsExpectedActions({
  applyFilters,
  filters,
  openAddPieceModal,
  openReceiveList,
  hasReceive,
  disabled,
  toggleColumn,
  visibleColumns,
}) {
  const intl = useIntl();

  return (
    <Dropdown
      data-testid="expected-pieces-action-dropdown"
      label={<FormattedMessage id="ui-receiving.button.actions" />}
      buttonProps={{ buttonStyle: 'primary' }}
    >
      <DropdownMenu>
        <MenuSection
          label={intl.formatMessage({ id: 'stripes-components.paneMenuActionsToggleLabel' })}
          id="expected-pieces-menu-actions"
        >
          <Button
            data-testid="add-piece-button"
            data-test-add-piece-button
            buttonStyle="dropdownItem"
            onClick={openAddPieceModal}
            disabled={disabled}
          >
            <Icon size="small" icon="plus-sign">
              <FormattedMessage id="ui-receiving.piece.button.addPiece" />
            </Icon>
          </Button>

          {hasReceive && (
            <Button
              data-testid="receive-button"
              data-test-title-receive-button
              buttonStyle="dropdownItem"
              onClick={openReceiveList}
              disabled={disabled}
            >
              <Icon size="small" icon="receive">
                <FormattedMessage id="ui-receiving.title.details.button.receive" />
              </Icon>
            </Button>
          )}
        </MenuSection>

        {hasReceive && (
          <FilterMenu prefix="expected-pieces">
            <CheckboxFilter
              dataOptions={SUPPLEMENT_MENU_FILTER_OPTIONS}
              name={`expected-${MENU_FILTERS.supplement}`}
              onChange={({ values }) => applyFilters(MENU_FILTERS.supplement, values)}
              selectedValues={filters[MENU_FILTERS.supplement]}
            />
          </FilterMenu>
        )}

        <ColumnManagerMenu
          prefix="expected-pieces"
          columnMapping={EXPECTED_PIECE_COLUMN_MAPPING}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
        />
      </DropdownMenu>
    </Dropdown>
  );
}

TitleDetailsExpectedActions.propTypes = {
  applyFilters: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  hasReceive: PropTypes.bool.isRequired,
  openAddPieceModal: PropTypes.func.isRequired,
  openReceiveList: PropTypes.func.isRequired,
  toggleColumn: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  disabled: PropTypes.bool,
};
