import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownMenu,
} from '@folio/stripes/components';
import { PIECE_STATUS } from '@folio/stripes-acq-components';

import { PIECE_ACTION_NAMES } from './constants';
import { getPieceActionMenu } from './utils';

import css from './ModalActionButtons.css';

export const ModalActionButtons = ({
  actionsDisabled,
  canDeletePiece,
  isEditMode,
  onClaimDelay,
  onClaimSend,
  onCreateAnotherPiece,
  onDelete,
  onReceive,
  onSave,
  onStatusChange,
  onUnreceivePiece,
  status,
}) => {
  const actionMenu = getPieceActionMenu({
    actionsDisabled,
    canDeletePiece,
    isEditMode,
    onClaimDelay,
    onClaimSend,
    onCreateAnotherPiece,
    onDelete,
    onReceive,
    onStatusChange,
    onUnreceivePiece,
    status,
  });
  const saveButtonLabelId = 'stripes-components.saveAndClose';
  const isSaveDisabled = actionsDisabled[PIECE_ACTION_NAMES.saveAndClose];

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

ModalActionButtons.propTypes = {
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

ModalActionButtons.defaultProps = {
  actionsDisabled: {},
  canDeletePiece: false,
  status: PIECE_STATUS.expected,
};
