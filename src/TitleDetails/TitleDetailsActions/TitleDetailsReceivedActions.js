import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ColumnManagerMenu } from '@folio/stripes/smart-components';
import {
  Button,
  Dropdown,
  DropdownMenu,
} from '@folio/stripes/components';

import { RECEIVED_PIECE_COLUMN_MAPPING } from '../constants';

export function TitleDetailsReceivedActions({ titleId, hasUnreceive, visibleColumns, toggleColumn }) {
  if (!hasUnreceive) return null;

  return (
    <Dropdown
      data-testid="received-pieces-action-dropdown"
      label={<FormattedMessage id="ui-receiving.button.actions" />}
      buttonProps={{ buttonStyle: 'primary' }}
    >
      <DropdownMenu>
        {hasUnreceive && (
          <Button
            data-test-title-unreceive-button
            to={`/receiving/unreceive/${titleId}`}
            buttonStyle="dropdownItem"
          >
            <FormattedMessage id="ui-receiving.title.details.button.unreceive" />
          </Button>
        )}
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
  hasUnreceive: PropTypes.bool.isRequired,
  titleId: PropTypes.string.isRequired,
  toggleColumn: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};
