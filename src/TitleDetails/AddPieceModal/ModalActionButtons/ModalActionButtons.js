import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownMenu,
} from '@folio/stripes/components';

import { PIECE_STATUS } from './constants';
import { getPieceActionMenus } from './utils';

import css from './ModalActionButtons.css';

export const ModalActionButtons = ({
  disabled,
  isCreateAnother,
  canDeletePiece,
  onCreateAnotherPiece,
  onDelete,
  onReceive,
  onSave,
  status,
}) => {
  const actionMenus = getPieceActionMenus({
    canDeletePiece,
    disabled,
    onCreateAnotherPiece,
    onDelete,
    onReceive,
    status,
  });
  const saveButtonLabelId = isCreateAnother ? 'stripes-core.button.save' : 'ui-receiving.piece.actions.saveAndClose';

  if (actionMenus.length === 0) {
    return (
      <Button
        buttonStyle="primary"
        data-test-add-piece-save
        disabled={disabled}
        onClick={onSave}
        marginBottom0
      >
        <FormattedMessage id={saveButtonLabelId} />
      </Button>
    );
  }

  return (
    <ButtonGroup>
      <Button
        buttonStyle="primary"
        data-test-add-piece-save
        disabled={disabled}
        onClick={onSave}
        marginBottom0
      >
        <FormattedMessage id={saveButtonLabelId} />
      </Button>
      <Dropdown
        buttonProps={{
          buttonStyle: 'primary',
          buttonClass: css.dropdownButton,
          marginBottom0: true,
        }}
      >
        <DropdownMenu data-role="menu">
          {actionMenus}
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
};

ModalActionButtons.propTypes = {
  canDeletePiece: PropTypes.bool,
  disabled: PropTypes.bool,
  isCreateAnother: PropTypes.bool,
  onCreateAnotherPiece: PropTypes.func,
  onDelete: PropTypes.func,
  onReceive: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  status: PropTypes.string,
};

ModalActionButtons.defaultProps = {
  canDeletePiece: false,
  disabled: false,
  isCreateAnother: false,
  status: PIECE_STATUS.expected,
};
