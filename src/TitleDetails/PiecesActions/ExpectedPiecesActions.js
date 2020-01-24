import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Dropdown,
  DropdownMenu,
  IconButton,
  MenuSection,
} from '@folio/stripes/components';
import { useToggle } from '@folio/stripes-acq-components';

// eslint-disable-next-line no-unused-vars
const tranformPieceToEdit = ({ barcode, callNumber, request, itemStatus, rowIndex, ...piece }) => piece;

const ExpectedPiecesActions = ({ onEditPiece, expectedPiece, onReceivePiece }) => {
  const [isActionMenuOpened, toggleActionMenu] = useToggle();
  const pieceToEdit = tranformPieceToEdit(expectedPiece);

  return (
    <Dropdown
      id="expected-piece-action-menu"
      open={isActionMenuOpened}
      onToggle={toggleActionMenu}
      hasPadding
      renderTrigger={({ getTriggerProps }) => (
        <IconButton
          {...getTriggerProps()}
          data-role="toggle"
          icon="ellipsis"
        />
      )}
      renderMenu={() => (
        <DropdownMenu
          data-role="menu"
          onToggle={toggleActionMenu}
        >
          <MenuSection id="expected-piece-actions">
            <Button
              buttonStyle="dropdownItem"
              data-test-button-receive-piece
              onClick={() => {
                toggleActionMenu();
                onReceivePiece(expectedPiece);
              }}
            >
              <FormattedMessage id="ui-receiving.piece.actions.receive" />
            </Button>
            <Button
              buttonStyle="dropdownItem"
              data-test-button-edit-piece
              onClick={() => {
                toggleActionMenu();
                onEditPiece(pieceToEdit);
              }}
            >
              <FormattedMessage id="ui-receiving.piece.actions.edit" />
            </Button>
            <Button
              buttonStyle="dropdownItem"
              data-test-button-view-piece
              onClick={toggleActionMenu}
            >
              <FormattedMessage id="ui-receiving.piece.actions.viewDetails" />
            </Button>
          </MenuSection>
        </DropdownMenu>
      )}
    />
  );
};

ExpectedPiecesActions.propTypes = {
  expectedPiece: PropTypes.object.isRequired,
  onEditPiece: PropTypes.func.isRequired,
  onReceivePiece: PropTypes.func.isRequired,
};

export default ExpectedPiecesActions;
