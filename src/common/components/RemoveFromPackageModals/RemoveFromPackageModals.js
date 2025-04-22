import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Modal,
  ConfirmationModal,
  Button,
} from '@folio/stripes/components';
import { ModalFooter } from '@folio/stripes-acq-components';

export function RemoveFromPackageModals({
  isRemoveFromPackageOpen,
  isRemoveHoldingsOpen,
  onConfirmRemoveFromPackage,
  toggleRemoveFromPackageModal,
  toggleRemoveHoldingsModal,
}) {
  const footer = (
    <ModalFooter
      renderStart={
        <Button marginBottom0 onClick={toggleRemoveHoldingsModal}>
          <FormattedMessage id="ui-receiving.title.edit.cancel" />
        </Button>
      }
      renderEnd={
        <>
          <Button
            buttonStyle="primary"
            marginBottom0
            onClick={() => {
              onConfirmRemoveFromPackage({ deleteHoldings: false });
              toggleRemoveHoldingsModal();
            }}
          >
            <FormattedMessage id="ui-receiving.title.confirmationModal.removeHolding.keepHoldings" />
          </Button>
          <Button
            buttonStyle="primary"
            marginBottom0
            onClick={() => {
              onConfirmRemoveFromPackage({ deleteHoldings: true });
              toggleRemoveHoldingsModal();
            }}
          >
            <FormattedMessage id="ui-receiving.title.confirmationModal.removeHolding.deleteHoldings" />
          </Button>
        </>
      }
    />
  );

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

      <Modal
        open={isRemoveHoldingsOpen}
        size="small"
        footer={footer}
        id="delete-piece-confirmation"
        label={<FormattedMessage id="ui-receiving.title.confirmationModal.removeHolding.heading" />}
      >
        <FormattedMessage id="ui-receiving.title.confirmationModal.removeHolding.message" />
      </Modal>
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
