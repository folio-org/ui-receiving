import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ColumnManagerMenu } from '@folio/stripes/smart-components';
import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
} from '@folio/stripes/components';

import { EXPECTED_PIECE_COLUMN_MAPPING } from '../constants';

export function TitleDetailsExpectedActions({
  openAddPieceModal,
  openReceiveList,
  hasReceive,
  disabled,
  toggleColumn,
  visibleColumns,
}) {
  if (!hasReceive) return null;

  return (
    <Dropdown
      data-testid="expected-pieces-action-dropdown"
      label={<FormattedMessage id="ui-receiving.button.actions" />}
      buttonProps={{ buttonStyle: 'primary' }}
    >
      <DropdownMenu>
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
  hasReceive: PropTypes.bool.isRequired,
  openAddPieceModal: PropTypes.func.isRequired,
  openReceiveList: PropTypes.func.isRequired,
  toggleColumn: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  disabled: PropTypes.bool,
};
