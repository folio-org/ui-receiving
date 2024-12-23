import noop from 'lodash/noop';
import {
  useCallback,
  useRef,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  DATA_EXPORT_CONFIGS_API,
  FOLIO_EXPORT_TYPE,
  getClaimingIntervalFromDate,
  PIECE_STATUS,
  useClaimsSend,
  useModalToggle,
  usePiecesStatusBatchUpdate,
} from '@folio/stripes-acq-components';
import { useOkapiKy } from '@folio/stripes/core';

export const usePieceClaimSend = (options = {}) => {
  const { organizationId, tenantId } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const confirmClaimSendPromise = useRef(Promise);
  const [isClaimSendModalOpen, toggleClaimSendModal] = useModalToggle();
  const [isIntegrationExists, setIntegrationExists] = useState();
  const [claimSendModalProps, setClaimSendModalProps] = useState({});

  /* Callback to handle claim send after form submit */
  const [sendClaimsHandler, setSendClaimsHandler] = useState(() => noop);

  const {
    isLoading: isClaimSendLoading,
    sendClaims,
  } = useClaimsSend({ tenantId });

  const {
    isLoading: isUpdatePiecesStatusLoading,
    updatePiecesStatus,
  } = usePiecesStatusBatchUpdate({ tenantId });

  const isLoading = isClaimSendLoading || isUpdatePiecesStatusLoading;

  const checkIntegrationExistance = useCallback(async () => {
    const searchParams = {
      query: `configName==${FOLIO_EXPORT_TYPE.CLAIMS}_${organizationId}*`,
    };

    return ky.get(DATA_EXPORT_CONFIGS_API, { searchParams })
      .then(({ configs }) => configs.length > 0)
      .catch(() => false);
  }, [ky, organizationId]);

  /* Trigger "Send claims" modal rendering with dynamic props */
  const onClaimSend = useCallback(async ({ internalNote, externalNote }) => {
    const isExists = await checkIntegrationExistance();
    const message = (
      <FormattedMessage
        id={`ui-receiving.piece.sendClaim.${isExists ? 'withIntegration' : 'withoutIntegration'}.message`}
      />
    );

    setIntegrationExists(isExists);
    toggleClaimSendModal();

    return new Promise((resolve, reject) => {
      confirmClaimSendPromise.current = { resolve, reject };

      setClaimSendModalProps({
        initialValues: { internalNote, externalNote },
        message,
      });
    });
  }, [checkIntegrationExistance, toggleClaimSendModal]);

  /* Resolves the "Send claims" modal promise and set the "sendClaimsHandler" callback to handle after form submit */
  const onConfirmClaimSend = useCallback(({
    claimingDate,
    externalNote,
    internalNote,
  }) => {
    const claimingInterval = getClaimingIntervalFromDate(claimingDate);

    const callback = async ({ id }) => {
      const result = isIntegrationExists
        ? await sendClaims({
          data: {
            claimingInterval,
            claimingPieceIds: [id],
            internalNote,
            externalNote,
          },
        })
        : await updatePiecesStatus({
          data: {
            claimingInterval,
            pieceIds: [id],
            receivingStatus: PIECE_STATUS.claimSent,
          },
        });

      return result;
    };

    toggleClaimSendModal();
    setSendClaimsHandler(() => callback);

    confirmClaimSendPromise.current.resolve({
      claimingInterval,
      externalNote,
      internalNote,
    });
  }, [isIntegrationExists, sendClaims, toggleClaimSendModal, updatePiecesStatus]);

  const onCancelClaimSend = useCallback(() => {
    toggleClaimSendModal();
  }, [toggleClaimSendModal]);

  return {
    claimSendModalProps,
    isClaimSendModalOpen,
    onCancelClaimSend,
    onConfirmClaimSend,
    onClaimSend,
    sendClaimsHandler,
    isLoading,
  };
};
