import queryString from 'query-string';
import {
  useCallback,
  useMemo,
} from 'react';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';
import {
  CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH,
  useCurrentUserTenants,
} from '@folio/stripes-acq-components';

import { useReceivingSearchContext } from '../../../contexts';

const { centralDefault, activeAffiliationDefault } = CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH;

const getTenantName = (tenants = [], tenantId) => {
  return tenants.find((tenant) => tenant.id === tenantId)?.name;
};

export const AffiliationsNavigation = () => {
  const history = useHistory();
  const { pathname, search } = useLocation();
  const currUserTenants = useCurrentUserTenants();

  const {
    activeSegment,
    activeTenantId,
    centralTenantId,
    defaultReceivingSearchSetting,
    setTargetTenant,
  } = useReceivingSearchContext();

  const [centralTenantName, activeTenantName] = useMemo(() => {
    return [
      getTenantName(currUserTenants, centralTenantId),
      getTenantName(currUserTenants, activeTenantId),
    ].filter(Boolean);
  }, [
    activeTenantId,
    centralTenantId,
    currUserTenants,
  ]);

  // TODO: apply logic for displaying
  const isNavigationVisible = (
    centralTenantId !== activeTenantId
    && [centralDefault, activeAffiliationDefault].includes(defaultReceivingSearchSetting)
    && (centralTenantName && activeTenantName)
  );

  const onSegmentSelect = useCallback((tenantId) => {
    const { activeTenant, ...queryParams } = queryString.parse(search);

    if (activeTenant !== tenantId) {
      setTargetTenant(tenantId);
      history.push({
        pathname,
        search: queryString.stringify({ activeTenant: tenantId, ...queryParams }),
      });
    }
  }, [
    history,
    pathname,
    search,
    setTargetTenant,
  ]);

  if (!isNavigationVisible) return null;

  return (
    <ButtonGroup fullWidth>
      <Button
        id="central-tenant-btn"
        buttonStyle={`${activeSegment === 'central' ? 'primary' : 'default'}`}
        onClick={() => onSegmentSelect(centralTenantId)}
      >
        {centralTenantName}
      </Button>
      <Button
        id="active-tenant-btn"
        buttonStyle={`${activeSegment === 'member' ? 'primary' : 'default'}`}
        onClick={() => onSegmentSelect(activeTenantId)}
      >
        {activeTenantName}
      </Button>
    </ButtonGroup>
  );
};
