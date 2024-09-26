import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownMenu,
} from '@folio/stripes/components';
import { PIECE_STATUS } from '@folio/stripes-acq-components';

import { PIECE_ACTION_NAMES } from '../../constants';
import { getPieceActionMenu } from './utils';

import css from './PieceFormActionButtons.css';

export const PieceFormActionButtons = ({
  actionsDisabled,
  canDeletePiece = false,
  isEditMode,
  onClaimDelay,
  onClaimSend,
  onCreateAnotherPiece,
  onDelete,
  onReceive,
  onSave,
  onStatusChange,
  onUnreceivePiece,
  status = PIECE_STATUS.expected,
}) => {
  const [actionsKey, setActionsKey] = useState(new Date());

  const actionMenu = getPieceActionMenu({
    actionsDisabled,
    canDeletePiece,
    isEditMode,
    onClaimDelay,
    onClaimSend,
    onCreateAnotherPiece: () => {
      setActionsKey(new Date());

      return onCreateAnotherPiece();
    },
    onDelete,
    onReceive,
    onStatusChange,
    onUnreceivePiece,
    status,
  });
  const saveButtonLabelId = 'stripes-components.saveAndClose';
  const isSaveDisabled = actionsDisabled?.[PIECE_ACTION_NAMES.saveAndClose];

  if (actionMenu.length === 0) {
    return (
      <Button
        buttonStyle="primary"
        data-test-add-piece-save
        disabled={isSaveDisabled}
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
        disabled={isSaveDisabled}
        onClick={onSave}
        marginBottom0
        buttonClass={css.saveButton}
      >
        <FormattedMessage id={saveButtonLabelId} />
      </Button>
      <Dropdown
        key={actionsKey}
        buttonProps={{
          buttonStyle: 'primary',
          buttonClass: css.dropdownButton,
          marginBottom0: true,
          'data-testid': 'dropdown-trigger-button',
        }}
      >
        <DropdownMenu data-role="menu">
          {actionMenu}
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
};

PieceFormActionButtons.propTypes = {
  actionsDisabled: PropTypes.objectOf(PropTypes.bool),
  canDeletePiece: PropTypes.bool,
  isEditMode: PropTypes.bool.isRequired,
  onClaimDelay: PropTypes.func.isRequired,
  onClaimSend: PropTypes.func.isRequired,
  onCreateAnotherPiece: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReceive: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onUnreceivePiece: PropTypes.func.isRequired,
  status: PropTypes.string,
};
