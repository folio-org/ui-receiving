import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { TENANT_ITEMS_API } from '../../../../common/constants';
import { useReceivingSearchContext } from '../../../../contexts';
import { useBoundItems } from './useBoundItems';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const params = {
  titleId: 'titleId',
  poLineId: 'poLineId',
};

const pieces = [{
  isBound: true,
  displaySummary: 'Electronic item',
  itemId: 'itemId',
  bindItemId: 'bindItemId',
  bindItemTenantId: 'tenantId',
  id: 'piece-id',
}];

const tenantItems = [
  {
    item: {
      id: 'itemId',
      status: { name: 'Available' },
    },
    tenantId: 'tenantId',
  },
];

describe('useBoundItems', () => {
  const getMock = jest.fn(() => ({
    json: () => Promise.resolve({ pieces }),
  }));

  const postMock = jest.fn(() => ({
    json: () => Promise.resolve({ tenantItems }),
  }));

  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: getMock,
        post: postMock,
      });
  });

  it('should fetch bound items', async () => {
    const { result } = renderHook(() => useBoundItems(params), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.items).toEqual(tenantItems.map(({ item, tenantId }) => ({ ...item, tenantId })));
    expect(getMock).toHaveBeenCalled();
    expect(postMock).toHaveBeenCalledWith(
      TENANT_ITEMS_API,
      expect.objectContaining({
        json: {
          tenantItemPairs: [{
            itemId: 'bindItemId',
            tenantId: 'activeTenantId',
          }],
        },
      }),
    );
  });

  describe('ECS - Central ordering', () => {
    beforeEach(() => {
      useReceivingSearchContext
        .mockClear()
        .mockReturnValue({ isCentralOrderingEnabled: true });
    });

    it('should fetch bound items with enabled central ordering', async () => {
      const { result } = renderHook(() => useBoundItems(params), { wrapper });

      await waitFor(() => expect(result.current.isFetching).toBeFalsy());

      expect(result.current.items).toEqual(tenantItems.map(({ item, tenantId }) => ({ ...item, tenantId })));
      expect(getMock).toHaveBeenCalled();
      expect(postMock).toHaveBeenCalledWith(
        TENANT_ITEMS_API,
        expect.objectContaining({
          json: {
            tenantItemPairs: [{
              itemId: 'bindItemId',
              tenantId: 'tenantId',
            }],
          },
        }),
      );
    });

    it('should fetch bound items with enabled central ordering and active tenant items', async () => {
      useReceivingSearchContext
        .mockReturnValue({
          isCentralOrderingEnabled: true,
          activeTenantId: 'activeTenantId',
          targetTenantId: 'targetTenantId',
          isTargetTenantCentral: true,
          centralTenantId: 'centralTenantId',
        });

      const { result } = renderHook(() => useBoundItems(params), { wrapper });

      await waitFor(() => expect(result.current.isFetching).toBeFalsy());

      expect(result.current.items).toEqual(tenantItems.map(({ item, tenantId }) => ({ ...item, tenantId })));
      expect(getMock).toHaveBeenCalled();
      expect(postMock).toHaveBeenCalledWith(
        TENANT_ITEMS_API,
        expect.objectContaining({
          json: {
            tenantItemPairs: [{
              itemId: 'bindItemId',
              tenantId: 'activeTenantId',
            }],
          },
        }),
      );
    });
  });
});
