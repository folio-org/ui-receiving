import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import { TRANSFER_REQUEST_ACTIONS } from '../constants';

export const TitleBindPiecesConfirmationModal = ({
  barCodesWithOpenRequests = [],
  id,
  onCancel,
  onConfirm,
  open,
  showDeleteMessage = false,
}) => {
  const modalAction = showDeleteMessage ? 'delete' : 'transfer';
  const footer = (
    <ModalFooter>
      {
        !showDeleteMessage && (
          <>
            <Button
              marginBottom0
              buttonStyle="primary"
              id={`clickable-${id}-transfer`}
              onClick={() => onConfirm(TRANSFER_REQUEST_ACTIONS.transfer)}
            >
              <FormattedMessage id="ui-receiving.bind.pieces.modal.button.transfer" />
            </Button>
            <Button
              marginBottom0
              buttonStyle="default"
              id={`clickable-${id}-not-transfer`}
              onClick={() => onConfirm(TRANSFER_REQUEST_ACTIONS.notTransfer)}
            >
              <FormattedMessage id="ui-receiving.bind.pieces.modal.button.not.transfer" />
            </Button>
          </>
        )
      }

      <Button
        marginBottom0
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
      showHeader={false}
      aria-labelledby={id}
      scope="module"
      size="small"
      footer={footer}
    >
      <FormattedMessage
        id={`ui-receiving.bind.pieces.modal.request.${modalAction}.message`}
        values={{ barCodes: barCodesWithOpenRequests.join(', ') }}
      />
    </Modal>
  );
};

TitleBindPiecesConfirmationModal.propTypes = {
  barCodesWithOpenRequests: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  showDeleteMessage: PropTypes.bool,
};
