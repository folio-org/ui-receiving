import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';

export const ConfirmRemoveFromPackageModal = ({
  onCancel,
  onConfirm,
  open,
}) => {
  return (
    <ConfirmationModal
      open={open}
      heading={<FormattedMessage id="ui-receiving.title.paneTitle.removeFromPackage" />}
      message={<FormattedMessage id="ui-receiving.title.confirmationModal.removeFromPackage.message" />}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmLabel={<FormattedMessage id="ui-receiving.title.confirmationModal.removeFromPackage.confirm" />}
    />
  );
};

ConfirmRemoveFromPackageModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool,
};
