import get from 'lodash/get';
import { useCallback } from 'react';

import {
  useModalToggle,
  useShowCallout,
  ResponseErrorsContainer,
} from '@folio/stripes-acq-components';

import { ERROR_CODES } from '../../constants';
import { useTitleMutation } from '../useTitleMutation';

export function useRemoveFromPackage({ id, onSuccess, tenantId }) {
  const [isRemoveFromPackageOpen, toggleRemoveFromPackageModal] = useModalToggle();
  const [isRemoveHoldingsOpen, toggleRemoveHoldingsModal] = useModalToggle();
  const showCallout = useShowCallout();
  const { deleteTitle } = useTitleMutation({ tenantId });

  const onConfirmRemoveFromPackage = useCallback(async (searchParams = {}) => {
    try {
      await deleteTitle({ id, searchParams });
      onSuccess();
      showCallout({ messageId: 'ui-receiving.title.confirmationModal.removeFromPackage.success' });
    } catch (error) {
      const { handler } = await ResponseErrorsContainer.create(error.response);
      const { code, message } = handler.getError();
      const errorCode = get(ERROR_CODES, code);

      toggleRemoveFromPackageModal();
      if (errorCode === ERROR_CODES.existingHoldingsForDeleteConfirmation) {
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
