import {
  useCallback,
  useMemo,
} from 'react';
import { useHistory } from 'react-router-dom';

import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';
import {
  CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH,
  useCurrentUserTenants,
} from '@folio/stripes-acq-components';

import {
  CENTRAL_RECEIVING_ROUTE,
  RECEIVING_ROUTE,
} from '../../../constants';
import { useReceivingSearchContext } from '../../../contexts';
import { CONSORTIUM_TENANT_TYPE } from '../../constants';

const { centralDefault, activeAffiliationDefault } = CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH;

const getTenantName = (tenants, tenantId) => {
  return tenants?.find((tenant) => tenant.id === tenantId)?.name;
};

export const AffiliationsNavigation = () => {
  const history = useHistory();
  const currUserTenants = useCurrentUserTenants();

  const {
    activeSegment,
    activeTenantId,
    centralTenantId,
    defaultReceivingSearchSetting,
    setTargetTenantId,
    targetTenantId,
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

  const isNavigationVisible = (
    centralTenantId !== activeTenantId
    && [centralDefault, activeAffiliationDefault].includes(defaultReceivingSearchSetting)
    && (centralTenantName && activeTenantName)
  );

  const onSegmentSelect = useCallback((segment, tenantId) => {
    if (targetTenantId !== tenantId) {
      setTargetTenantId(tenantId);

      const pathname = {
        [CONSORTIUM_TENANT_TYPE.member]: RECEIVING_ROUTE,
        [CONSORTIUM_TENANT_TYPE.central]: CENTRAL_RECEIVING_ROUTE,
      }[segment];

      history.push({ pathname });
    }
  }, [
    history,
    setTargetTenantId,
    targetTenantId,
  ]);

  if (!isNavigationVisible) return null;

  return (
    <ButtonGroup fullWidth>
      <Button
        id="central-tenant-btn"
        buttonStyle={`${activeSegment === CONSORTIUM_TENANT_TYPE.central ? 'primary' : 'default'}`}
        onClick={() => onSegmentSelect(CONSORTIUM_TENANT_TYPE.central, centralTenantId)}
      >
        {centralTenantName}
      </Button>
      <Button
        id="active-tenant-btn"
        buttonStyle={`${activeSegment === CONSORTIUM_TENANT_TYPE.member ? 'primary' : 'default'}`}
        onClick={() => onSegmentSelect(CONSORTIUM_TENANT_TYPE.member, activeTenantId)}
      >
        {activeTenantName}
      </Button>
    </ButtonGroup>
  );
};
