import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import { TRANSFER_REQUEST_ACTIONS } from '../constants';

export const TitleBindPiecesConfirmationModal = ({
  id,
  onCancel,
  onConfirm,
  open,
}) => {
  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        id={`clickable-${id}-transfer`}
        onClick={() => onConfirm(TRANSFER_REQUEST_ACTIONS.transfer)}
      >
        <FormattedMessage id="ui-receiving.bind.pieces.modal.button.transfer" />
      </Button>
      <Button
        buttonStyle="default"
        id={`clickable-${id}-not-transfer`}
        onClick={() => onConfirm(TRANSFER_REQUEST_ACTIONS.notTransfer)}
      >
        <FormattedMessage id="ui-receiving.bind.pieces.modal.button.not.transfer" />
      </Button>
      <Button
        buttonStyle="default"
        id={`clickable-${id}-cancel`}
        onClick={() => onConfirm(TRANSFER_REQUEST_ACTIONS.cancel)}
      >
        <FormattedMessage id="stripes-core.button.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open={open}
      onClose={onCancel}
      id={id}
      label={<FormattedMessage id="ui-receiving.bind.pieces.modal.heading" />}
      aria-labelledby={id}
      scope="module"
      size="small"
      footer={footer}
    >
      <FormattedMessage id="ui-receiving.bind.pieces.modal.message" />
    </Modal>
  );
};

TitleBindPiecesConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
