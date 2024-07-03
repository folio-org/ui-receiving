import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH,
  useCurrentUserTenants,
} from '@folio/stripes-acq-components';

import { useReceivingSearchContext } from '../../../contexts';
import { CONSORTIUM_TENANT_TYPE } from '../../constants';
import { AffiliationsNavigation } from './AffiliationsNavigation';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useCurrentUserTenants: jest.fn(),
}));

const renderAffiliationsNavigation = (props = {}) => render(
  <AffiliationsNavigation
    {...props}
  />,
  { wrapper: MemoryRouter },
);

const receivingContextMock = {
  activeSegment: CONSORTIUM_TENANT_TYPE.member,
  activeTenantId: 'memberTenantId',
  centralTenantId: 'centralTenantId',
  defaultReceivingSearchSetting: CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.activeAffiliationDefault,
  setTargetTenantId: jest.fn(),
  targetTenantId: 'memberTenantId',
};

const tenants = [
  { id: 'memberTenantId', name: 'Member' },
  { id: 'centralTenantId', name: 'Central' },
];

describe('AffiliationsNavigation', () => {
  beforeEach(() => {
    useCurrentUserTenants.mockReturnValue(tenants);
    useReceivingSearchContext
      .mockClear()
      .mockReturnValue(receivingContextMock);
  });

  it('should render toggle between tenants', () => {
    renderAffiliationsNavigation();

    tenants.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('should handle switch selected tenant', async () => {
    renderAffiliationsNavigation();

    await user.click(screen.getByText(tenants[1].name));

    expect(receivingContextMock.setTargetTenantId).toHaveBeenCalled();
  });
});
