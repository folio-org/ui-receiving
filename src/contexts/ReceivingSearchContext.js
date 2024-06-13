import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import {
  checkIfUserInCentralTenant,
  useStripes,
} from '@folio/stripes/core';
import {
  CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH,
  getConsortiumCentralTenantId,
  useCentralOrderingSettings,
  useDefaultReceivingSearchSettings,
} from '@folio/stripes-acq-components';

export const ReceivingSearchContext = createContext();

const getTargetTenantId = (
  { value } = {},
  activeTenantQueryParam,
  activeTenantId,
  centralTenantId,
) => {
  const resolversMap = {
    [CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.activeAffiliationOnly]: activeTenantId,
    [CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.centralOnly]: centralTenantId,
    /*
      When moving between applications, the search for a specific application can be saved,
      so to correctly direct data retrieval requests, it is necessary to store and extract the active tenant from the search.
    */
    [CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.centralDefault]: activeTenantQueryParam || centralTenantId,
    [CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.activeAffiliationDefault]: activeTenantQueryParam || activeTenantId,
  };

  return resolversMap[value] || activeTenantId;
};

const getActiveSegment = (targetTenant, centralTenantId) => {
  if (!targetTenant) return null;

  return targetTenant === centralTenantId ? 'central' : 'member';
};

// TODO: specify ECS mode
export const ReceivingSearchContextProvider = ({ children }) => {
  const stripes = useStripes();
  const location = useLocation();

  const activeTenantId = stripes.okapi.tenant;
  const centralTenantId = getConsortiumCentralTenantId(stripes);

  const [targetTenant, setTargetTenant] = useState();

  const {
    enabled: isCentralOrderingEnabled,
    isLoading: isCentralOrderingSettingsLoading,
  } = useCentralOrderingSettings({
    // TODO: recheck
    enabled: checkIfUserInCentralTenant(stripes),
  });

  const {
    data,
    isDefaultReceivingSearchSettingsLoading,
  } = useDefaultReceivingSearchSettings({
    onSuccess: (setting) => {
      const { activeTenant } = queryString.parse(location.search);

      setTargetTenant(getTargetTenantId(setting, activeTenant, activeTenantId, centralTenantId));
    },
    enabled: isCentralOrderingEnabled,
  });

  const isLoading = isCentralOrderingSettingsLoading || isDefaultReceivingSearchSettingsLoading;

  const value = useMemo(() => ({
    activeSegment: getActiveSegment(targetTenant, centralTenantId),
    activeTenantId,
    centralTenantId,
    defaultReceivingSearchSetting: data?.value,
    isCentralOrderingEnabled,
    isLoading,
    setTargetTenant,
    targetTenant,
  }), [
    activeTenantId,
    centralTenantId,
    data?.value,
    isCentralOrderingEnabled,
    isLoading,
    targetTenant,
  ]);

  return (
    <ReceivingSearchContext.Provider value={value}>
      {children}
    </ReceivingSearchContext.Provider>
  );
};

ReceivingSearchContextProvider.propTypes = {
  children: PropTypes.node,
};

export const useReceivingSearchContext = () => useContext(ReceivingSearchContext);
