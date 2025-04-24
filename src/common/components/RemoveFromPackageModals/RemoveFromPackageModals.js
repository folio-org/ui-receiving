import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';
import { DeleteHoldingsModal } from '@folio/stripes-acq-components';

export function RemoveFromPackageModals({
  isRemoveFromPackageOpen,
  isRemoveHoldingsOpen,
  onConfirmRemoveFromPackage,
  toggleRemoveFromPackageModal,
  toggleRemoveHoldingsModal,
}) {
  return (
    <>
      <ConfirmationModal
        open={isRemoveFromPackageOpen}
        heading={<FormattedMessage id="ui-receiving.title.paneTitle.removeFromPackage" />}
        message={<FormattedMessage id="ui-receiving.title.confirmationModal.removeFromPackage.message" />}
        onConfirm={() => onConfirmRemoveFromPackage()}
        onCancel={toggleRemoveFromPackageModal}
        confirmLabel={<FormattedMessage id="ui-receiving.title.confirmationModal.removeFromPackage.confirm" />}
      />

      {isRemoveHoldingsOpen && (
        <DeleteHoldingsModal
          message={<FormattedMessage id="ui-receiving.title.confirmationModal.removeHolding.message" />}
          onCancel={toggleRemoveHoldingsModal}
          onConfirm={() => {
            onConfirmRemoveFromPackage({ deleteHoldings: true });
            toggleRemoveHoldingsModal();
          }}
          onKeepHoldings={() => {
            onConfirmRemoveFromPackage({ deleteHoldings: false });
            toggleRemoveHoldingsModal();
          }}
        />
      )}
    </>
  );
}

RemoveFromPackageModals.propTypes = {
  isRemoveFromPackageOpen: PropTypes.bool,
  isRemoveHoldingsOpen: PropTypes.bool,
  onConfirmRemoveFromPackage: PropTypes.func.isRequired,
  toggleRemoveFromPackageModal: PropTypes.func.isRequired,
  toggleRemoveHoldingsModal: PropTypes.func.isRequired,
};
