import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';

export const ConfirmReceivingModal = ({
  onCancel,
  onConfirm,
  open = false,
}) => {
  const intl = useIntl();

  const confirmReceivingModalLabel = intl.formatMessage({ id: 'ui-receiving.piece.confirmReceiving.title' });

  return (
    <ConfirmationModal
      aria-label={confirmReceivingModalLabel}
      id="confirm-receiving"
      open={open}
      confirmLabel={intl.formatMessage({ id: 'ui-receiving.piece.actions.confirm' })}
      heading={confirmReceivingModalLabel}
      message={intl.formatMessage({ id: 'ui-receiving.piece.confirmReceiving.message' })}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
};

ConfirmReceivingModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool,
};
