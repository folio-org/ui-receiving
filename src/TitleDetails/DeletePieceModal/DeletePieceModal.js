import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Modal,
  ConfirmationModal,
} from '@folio/stripes/components';

export const DeletePieceModal = ({
  isLastConnectedItem,
  footer,
  onConfirm,
  onCancel,
}) => {
  if (isLastConnectedItem) {
    return (
      <Modal
        open
        size="small"
        footer={footer}
        label={<FormattedMessage id="ui-receiving.piece.delete.heading" />}
      >
        <FormattedMessage id="ui-receiving.piece.delete.deleteHoldingsAndItem.message" />
      </Modal>
    );
  }

  return (
    <ConfirmationModal
      id="delete-piece-confirmation"
      confirmLabel={<FormattedMessage id="ui-receiving.piece.delete.confirm" />}
      heading={<FormattedMessage id="ui-receiving.piece.delete.heading" />}
      message={<FormattedMessage id="ui-receiving.piece.delete.message" />}
      onCancel={onCancel}
      onConfirm={onConfirm}
      open
    />
  );
};

DeletePieceModal.propTypes = {
  isLastConnectedItem: PropTypes.bool.isRequired,
  footer: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
