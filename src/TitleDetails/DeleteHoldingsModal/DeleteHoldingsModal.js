import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Button, Modal } from '@folio/stripes/components';
import { ModalFooter } from '@folio/stripes-acq-components';

export const DeleteHoldingsModal = ({
  onCancel,
  onKeepHoldings,
  onConfirm,
}) => {
  const start = (
    <Button
      marginBottom0
      onClick={onCancel}
    >
      <FormattedMessage id="ui-receiving.piece.actions.cancel" />
    </Button>
  );
  const end = (
    <>
      <Button
        buttonStyle="primary"
        marginBottom0
        onClick={onKeepHoldings}
      >
        <FormattedMessage id="ui-receiving.piece.actions.edit.keepHoldings" />
      </Button>
      <Button
        buttonStyle="primary"
        marginBottom0
        onClick={onConfirm}
      >
        <FormattedMessage id="ui-receiving.piece.actions.delete.deleteHoldings" />
      </Button>
    </>
  );

  const footer = (
    <ModalFooter
      renderStart={start}
      renderEnd={end}
    />
  );

  return (
    <Modal
      open
      size="small"
      footer={footer}
      id="delete-holdings-confirmation"
      label={<FormattedMessage id="ui-receiving.piece.actions.delete.deleteHoldings" />}
    >
      <FormattedMessage id="ui-receiving.piece.actions.edit.deleteHoldings.message" />
    </Modal>
  );
};

DeleteHoldingsModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onKeepHoldings: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
