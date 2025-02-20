import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import { useRef } from 'react';
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
  const onToggleRef = useRef(noop);

  const actionMenu = getPieceActionMenu({
    actionsDisabled,
    isEditMode,
    onClaimDelay,
    onClaimSend,
    onCreateAnotherPiece,
    onDelete,
    onReceive,
    onStatusChange,
    onToggle: onToggleRef.current,
    onUnreceivePiece,
    status,
  });
  const saveButtonLabelId = 'stripes-components.saveAndClose';
  const isSaveDisabled = actionsDisabled?.[PIECE_ACTION_NAMES.saveAndClose];
  const isActionsMenuDisabled = isSaveDisabled && (actionsDisabled?.[PIECE_ACTION_NAMES.delete] || !isEditMode);

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
        disabled={isActionsMenuDisabled}
        buttonProps={{
          buttonStyle: 'primary',
          buttonClass: css.dropdownButton,
          marginBottom0: true,
          'data-testid': 'dropdown-trigger-button',
        }}
      >
        {({ onToggle }) => {
          onToggleRef.current = onToggle;

          return (
            <DropdownMenu data-role="menu">
              {actionMenu}
            </DropdownMenu>
          );
        }}
      </Dropdown>
    </ButtonGroup>
  );
};

PieceFormActionButtons.propTypes = {
  actionsDisabled: PropTypes.objectOf(PropTypes.bool),
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
