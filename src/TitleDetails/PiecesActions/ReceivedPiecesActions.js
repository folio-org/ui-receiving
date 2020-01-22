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

const transformReceivedPiece = ({
  id,
  caption,
  comment,
  pieceFormat,
  itemId,
  locationId,
  poLineId,
  receivingStatus,
  supplement,
  receivedDate,
}) => ({
  id,
  caption,
  comment,
  format: pieceFormat,
  itemId,
  locationId,
  poLineId,
  receivingStatus,
  supplement,
  receivedDate,
});

const ReceivedPiecesActions = ({ onUnreceivePiece, receivedPiece }) => {
  const [isActionMenuOpened, toggleActionMenu] = useToggle();
  const piece = transformReceivedPiece(receivedPiece);

  return (
    <Dropdown
      id="received-piece-action-menu"
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
          <MenuSection id="received-piece-actions">
            <Button
              buttonStyle="dropdownItem"
              data-test-button-unreceive-piece
              onClick={() => {
                toggleActionMenu();
                onUnreceivePiece(piece);
              }}
            >
              <FormattedMessage id="ui-receiving.piece.actions.unreceive" />
            </Button>
            <Button
              buttonStyle="dropdownItem"
              data-test-button-view-piece
              onClick={() => {
                toggleActionMenu();
              }}
            >
              <FormattedMessage id="ui-receiving.piece.actions.viewDetails" />
            </Button>
          </MenuSection>
        </DropdownMenu>
      )}
    />
  );
};

ReceivedPiecesActions.propTypes = {
  onUnreceivePiece: PropTypes.func.isRequired,
  receivedPiece: PropTypes.object.isRequired,
};

export default ReceivedPiecesActions;
