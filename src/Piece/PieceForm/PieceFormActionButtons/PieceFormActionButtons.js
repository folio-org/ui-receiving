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
import {
  getPieceActionsMenu,
  getPieceActionsByStatus,
} from './utils';

import css from './PieceFormActionButtons.css';

export const PieceFormActionButtons = ({
  actionsDisabled,
  connectedTasksJobsProps,
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
  submitting,
}) => {
  const pieceActions = getPieceActionsByStatus(status);

  const saveButtonLabelId = 'stripes-components.saveAndClose';
  const isSaveDisabled = actionsDisabled?.[PIECE_ACTION_NAMES.saveAndClose] || submitting;
  const isActionsMenuDisabled = submitting || (!isEditMode && isSaveDisabled);

  if (pieceActions.length === 0 && !connectedTasksJobsProps) {
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
          const actionMenu = getPieceActionsMenu({
            actions: pieceActions,
            actionsDisabled,
            connectedTasksJobsProps,
            isEditMode,
            onClaimDelay,
            onClaimSend,
            onCreateAnotherPiece,
            onDelete,
            onReceive,
            onStatusChange,
            onToggle,
            onUnreceivePiece,
          });

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
  connectedTasksJobsProps: PropTypes.shape({
    recordId: PropTypes.string.isRequired,
    recordObject: PropTypes.object,
    recordType: PropTypes.string.isRequired,
  }),
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
  submitting: PropTypes.bool,
};
