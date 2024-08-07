import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import { useReceivingSearchContext } from '../../contexts';
import { TRANSFER_REQUEST_ACTIONS } from '../constants';

export const TitleBindPiecesConfirmationModal = ({
  bindPieceData = {},
  id,
  listOfOpenRequests,
  onCancel,
  onConfirm,
  open,
}) => {
  const { crossTenant, activeTenantId } = useReceivingSearchContext();

  const barcodes = useMemo(() => {
    return listOfOpenRequests
      .filter(Boolean)
      .map(({ barcode }) => barcode);
  }, [listOfOpenRequests]);

  const withDeleteMessage = useMemo(() => {
    const currentTenantId = bindPieceData?.bindItem?.tenantId || activeTenantId;

    if (!crossTenant) return false;

    return listOfOpenRequests.some(({ request }) => request.tenantId !== currentTenantId);
  }, [activeTenantId, bindPieceData, crossTenant, listOfOpenRequests]);

  const modalAction = withDeleteMessage ? 'delete' : 'transfer';
  const footer = (
    <ModalFooter>
      {
        !withDeleteMessage && (
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
        id={`ui-receiving.bind.pieces.modal.${modalAction}.message`}
        values={{ barcodes: barcodes.join(', ') }}
      />
    </Modal>
  );
};

TitleBindPiecesConfirmationModal.propTypes = {
  bindPieceData: PropTypes.object,
  id: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  listOfOpenRequests: PropTypes.arrayOf(PropTypes.object),
};
