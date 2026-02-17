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
  DeleteHoldingsModal,
  getHoldingLocationName,
  useConsortiumTenants,
} from '@folio/stripes-acq-components';

import { useAsyncConfirmationModal } from '../common/hooks';

export const useDeleteHoldingsModal = ({ crossTenant = false } = {}) => {
  const { tenants } = useConsortiumTenants();

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
    const tenantsMap = new Map(tenants?.map((t) => [t.id, t]));

    setAbandonedHoldingNames(() => {
      return abandonedHoldingsResults.map((el) => {
        const holdingName = getHoldingLocationName(holdingsMap.get(el.id), Object.fromEntries(locationsMap.entries()));
        const tenantName = crossTenant && tenantsMap.get(holdingsMap.get(el.id)?.tenantId)?.name;

        return [holdingName, tenantName && <i>&nbsp;({tenantName})</i>].filter(Boolean);
      });
    });

    return init();
  }, [crossTenant, init, tenants]);

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
