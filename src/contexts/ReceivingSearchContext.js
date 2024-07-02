import PropTypes from 'prop-types';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import {
  CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH,
  isTenantConsortiumCentral,
  getConsortiumCentralTenantId,
  useCentralOrderingContext,
  useDefaultReceivingSearchSettings,
} from '@folio/stripes-acq-components';

import { CONSORTIUM_TENANT_TYPE } from '../common/constants';
import {
  RECEIVING_ROUTE,
  CENTRAL_RECEIVING_ROUTE,
} from '../constants';

export const ReceivingSearchContext = createContext();

const { central, member } = CONSORTIUM_TENANT_TYPE;

const getTargetTenantId = (
  defaultReceivingSearchSetting,
  activeTenantId,
  centralTenantId,
) => {
  const resolversMap = {
    [CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.activeAffiliationOnly]: [activeTenantId, member],
    [CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.centralOnly]: [centralTenantId, central],
    [CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.centralDefault]: [centralTenantId, central],
    [CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.activeAffiliationDefault]: [activeTenantId, member],
  };

  return resolversMap[defaultReceivingSearchSetting] || [activeTenantId, member];
};

const getActiveSegment = (targetTenantId, centralTenantId) => {
  if (!targetTenantId) return null;

  return targetTenantId === centralTenantId ? central : member;
};

// TODO: specify ECS mode
export const ReceivingSearchContextProvider = ({ children }) => {
  const stripes = useStripes();
  const history = useHistory();

  const activeTenantId = stripes.okapi.tenant;
  const centralTenantId = getConsortiumCentralTenantId(stripes);

  const [targetTenantId, setTargetTenantId] = useState();

  const { isCentralOrderingEnabled } = useCentralOrderingContext();

  const {
    data,
    isDefaultReceivingSearchSettingsLoading,
  } = useDefaultReceivingSearchSettings({ enabled: isCentralOrderingEnabled });

  const defaultReceivingSearchSetting = data?.value;

  useEffect(() => {
    const { pathname, ...rest } = history.location;

    const [targetTenantIdToSet, tenantType] = getTargetTenantId(
      defaultReceivingSearchSetting,
      activeTenantId,
      centralTenantId,
    );

    setTargetTenantId(targetTenantIdToSet);

    const isCentralRoute = pathname.startsWith(CENTRAL_RECEIVING_ROUTE);
    const shouldRedirect = tenantType === central ? !isCentralRoute : isCentralRoute;

    if (shouldRedirect) {
      const [activeRoute, targetRoute] = {
        [member]: [CENTRAL_RECEIVING_ROUTE, RECEIVING_ROUTE],
        [central]: [RECEIVING_ROUTE, CENTRAL_RECEIVING_ROUTE],
      }[tenantType];

      history.replace({
        pathname: pathname.replace(activeRoute, targetRoute),
        ...rest,
      });
    }
  }, [
    activeTenantId,
    centralTenantId,
    defaultReceivingSearchSetting,
    history,
    isCentralOrderingEnabled,
  ]);

  const isLoading = isDefaultReceivingSearchSettingsLoading;
  const isTargetTenantCentral = isTenantConsortiumCentral(stripes, targetTenantId);
  const isTargetTenantForeign = targetTenantId !== activeTenantId;
  const crossTenant = isCentralOrderingEnabled && isTargetTenantCentral;
  const isCentralRouting = crossTenant && [
    CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.activeAffiliationDefault,
    CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.centralDefault,
  ].includes(defaultReceivingSearchSetting);

  const value = useMemo(() => ({
    activeSegment: getActiveSegment(targetTenantId, centralTenantId),
    activeTenantId,
    centralTenantId,
    crossTenant,
    defaultReceivingSearchSetting,
    isCentralOrderingEnabled,
    isCentralRouting,
    isLoading,
    isTargetTenantCentral,
    isTargetTenantForeign,
    setTargetTenantId,
    targetTenantId,
  }), [
    activeTenantId,
    centralTenantId,
    crossTenant,
    defaultReceivingSearchSetting,
    isCentralOrderingEnabled,
    isCentralRouting,
    isLoading,
    isTargetTenantCentral,
    isTargetTenantForeign,
    targetTenantId,
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
