import { useCallback } from 'react';

import { useModalToggle, useShowCallout } from '@folio/stripes-acq-components';

import { useTitleMutation } from '../useTitleMutation';

const ERROR_CODES = {
  emptyHoldings: 'existingHoldingsForDeleteConfirmation',
};

export function useRemoveFromPackage({ id, onSuccess }) {
  const [isRemoveFromPackageOpen, toggleRemoveFromPackageModal] = useModalToggle();
  const [isRemoveHoldingsOpen, toggleRemoveHoldingsModal] = useModalToggle();
  const showCallout = useShowCallout();
  const { deleteTitle } = useTitleMutation();

  const onConfirmRemoveFromPackage = useCallback(async (searchParams = {}) => {
    try {
      await deleteTitle({ id, searchParams });
      onSuccess();
      showCallout({ messageId: 'ui-receiving.title.confirmationModal.removeFromPackage.success' });
    } catch (error) {
      const { errors } = await error.response.json();
      const { message, code } = errors[0];

      if (code === ERROR_CODES.emptyHoldings) {
        toggleRemoveFromPackageModal();
        toggleRemoveHoldingsModal();
      } else {
        showCallout({ messageId: message, type: 'error' });
      }
    }
  }, [
    deleteTitle,
    id,
    onSuccess,
    showCallout,
    toggleRemoveFromPackageModal,
    toggleRemoveHoldingsModal,
  ]);

  return {
    isRemoveFromPackageOpen,
    isRemoveHoldingsOpen,
    onConfirmRemoveFromPackage,
    toggleRemoveFromPackageModal,
    toggleRemoveHoldingsModal,
  };
}
