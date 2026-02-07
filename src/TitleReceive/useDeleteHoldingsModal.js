import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Layout,
  List,
} from '@folio/stripes/components';
import {
  getHoldingLocationName,
  DeleteHoldingsModal,
} from '@folio/stripes-acq-components';

import { useAsyncConfirmationModal } from '../common/hooks';

export const useDeleteHoldingsModal = () => {
  const {
    cancel: cancelDeleteHoldingsModal,
    confirm: confirmDeleteHoldingsModal,
    init,
    isModalOpen: isDeleteHoldingsModalOpen,
  } = useAsyncConfirmationModal();

  const [abandonedHoldingNames, setAbandonedHoldingNames] = useState();

  const initDeleteHoldingsModal = useCallback((abandonedHoldingsResults, holdings, locations) => {
    const holdingsMap = new Map(holdings?.map(h => [h.id, h]));
    const locationsMap = new Map(locations?.map((l) => [l.id, l]));

    setAbandonedHoldingNames(() => {
      return abandonedHoldingsResults.map((el) => {
        return getHoldingLocationName(holdingsMap.get(el.id), Object.fromEntries(locationsMap.entries()));
      });
    });

    return init();
  }, [init]);

  const message = useMemo(() => (
    <>
      <FormattedMessage id="stripes-acq-components.holdings.deleteModal.message" />
      <Layout className="marginTop1">
        <List
          items={abandonedHoldingNames}
          listStyle="bullets"
        />
      </Layout>
    </>
  ), [abandonedHoldingNames]);

  const modal = useMemo(() => {
    return isDeleteHoldingsModalOpen && (
      <DeleteHoldingsModal
        message={message}
        onCancel={cancelDeleteHoldingsModal}
        onKeepHoldings={() => confirmDeleteHoldingsModal(false)}
        onConfirm={() => confirmDeleteHoldingsModal(true)}
      />
    );
  }, [cancelDeleteHoldingsModal, confirmDeleteHoldingsModal, isDeleteHoldingsModalOpen, message]);

  return {
    initDeleteHoldingsModal,
    modal,
  };
};
