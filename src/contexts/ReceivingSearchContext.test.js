import { MemoryRouter } from 'react-router-dom';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';
import {
  CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH,
  useCentralOrderingContext,
  useDefaultReceivingSearchSettings,
} from '@folio/stripes-acq-components';

import {
  ReceivingSearchContextProvider,
  useReceivingSearchContext,
} from './ReceivingSearchContext';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useCentralOrderingContext: jest.fn(() => ({})),
  useDefaultReceivingSearchSettings: jest.fn(() => ({})),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    <ReceivingSearchContextProvider>
      {children}
    </ReceivingSearchContextProvider>
  </MemoryRouter>
);

const stripesBase = {
  okapi: {
    tenant: 'activeTenant',
  },
};

describe('Receiving search context', () => {
  beforeAll(() => {
    useCentralOrderingContext
      .mockClear()
      .mockReturnValue({ isCentralOrderingEnabled: false });
    useStripes
      .mockClear()
      .mockReturnValue(stripesBase);
  });

  it('should provide proper search context for default search mode', () => {
    const { result } = renderHook(() => useReceivingSearchContext(), { wrapper });

    const {
      targetTenantId,
      isCentralRouting,
      crossTenant,
    } = result.current;

    expect(targetTenantId).toBe(stripesBase.okapi.tenant);
    expect(isCentralRouting).toBeFalsy();
    expect(crossTenant).toBeFalsy();
  });

  describe('ECS enabled', () => {
    beforeAll(() => {
      useStripes
        .mockClear()
        .mockReturnValue({
          ...stripesBase,
          user: {
            user: {
              consortium: {
                centralTenantId: 'centralTenantId',
              },
            },
          },
        });
    });

    describe('Central ordering enabled', () => {
      beforeEach(() => {
        useCentralOrderingContext
          .mockClear()
          .mockReturnValue({ isCentralOrderingEnabled: true });
      });

      it.each(
        Object.values(CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH),
      )('should provide proper search context when the receiving search setting is %s', (value) => {
        useDefaultReceivingSearchSettings
          .mockClear()
          .mockReturnValue({ data: { value } });

        const { result } = renderHook(() => useReceivingSearchContext(), { wrapper });

        const {
          crossTenant,
          isCentralRouting,
          isTargetTenantCentral,
          targetTenantId,
        } = result.current;

        const resultsMap = {
          [CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.activeAffiliationOnly]: [false, false, false, 'activeTenant'],
          [CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.centralOnly]: [true, false, true, 'centralTenantId'],
          [CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.centralDefault]: [true, true, true, 'centralTenantId'],
          [CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.activeAffiliationDefault]: [false, false, false, 'activeTenant'],
        };

        expect([
          crossTenant,
          isCentralRouting,
          isTargetTenantCentral,
          targetTenantId,
        ]).toEqual(resultsMap[value]);
      });
    });
  });
});
