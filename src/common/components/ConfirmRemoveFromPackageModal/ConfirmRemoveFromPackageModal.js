import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';
import { useToggle } from '@folio/stripes-acq-components';

export const ConfirmRemoveFromPackageModal = ({
  displayDeleteHoldingsConfirmation,
  onCancel,
  onConfirm,
  open,
}) => {
  const [isDeleteHoldingsConfirmationOpen, toggleDeleteHoldingsConfirmationModal] = useToggle(false);

  return (
    <>
      <ConfirmationModal
        open={open}
        heading={<FormattedMessage id="ui-receiving.title.paneTitle.removeFromPackage" />}
        message={<FormattedMessage id="ui-receiving.title.confirmationModal.removeFromPackage.message" />}
        onConfirm={() => {
          onCancel();
          onConfirm();
        }}
        onCancel={onCancel}
        confirmLabel={<FormattedMessage id="ui-receiving.title.confirmationModal.removeFromPackage.confirm" />}
      />
      {/* <ConfirmationModal
        open={isDeleteHoldingsConfirmationOpen}
        heading={<FormattedMessage id="ui-receiving.title.confirmationModal.removeHolding.heading" />}
        message={<FormattedMessage id="ui-receiving.title.confirmationModal.removeHolding.message" />}
        confirmLabel={<FormattedMessage id="ui-receiving.title.confirmationModal.removeHolding.confirmLabel" />}
        onConfirm={() => {
          onConfirm({ deleteHoldings: false });
          toggleDeleteHoldingsConfirmationModal();
        }}
        cancelLabel={<FormattedMessage id="ui-receiving.title.confirmationModal.removeHolding.cancelLabel" />}
        onCancel={() => {
          onConfirm({ deleteHoldings: true });
          toggleDeleteHoldingsConfirmationModal();
        }}
      /> */}
    </>
  );
};

ConfirmRemoveFromPackageModal.propTypes = {
  displayDeleteHoldingsConfirmation: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool,
};
