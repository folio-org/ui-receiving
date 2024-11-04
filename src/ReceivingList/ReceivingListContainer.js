import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  getHoldingLocationName,
  RESULT_COUNT_INCREMENT,
  usePagination,
} from '@folio/stripes-acq-components';

import ReceivingList from './ReceivingList';

import { useReceivingSearchContext } from '../contexts';
import { useReceiving } from './hooks';
import {
  fetchConsortiumOrderLineHoldings,
  fetchConsortiumOrderLineLocations,
  fetchLinesOrders,
  fetchOrderLineHoldings,
  fetchOrderLineLocations,
  fetchTitleOrderLines,
} from './utils';

const resetData = () => {};

const ReceivingListContainer = () => {
  const intl = useIntl();
  const stripes = useStripes();

  const {
    isLoading: isSearchModeLoading,
    crossTenant,
    isCentralOrderingEnabled,
    isTargetTenantCentral,
    targetTenantId,
  } = useReceivingSearchContext();

  const invalidReferenceMessage = intl.formatMessage({ id: 'ui-receiving.titles.invalidReference' });

  const fetchReferences = useCallback(async (titles, ky) => {
    const orderLinesResponse = await fetchTitleOrderLines(ky, titles, {});
    const isConsortiaRequest = isCentralOrderingEnabled && isTargetTenantCentral;

    const holdingsResponse = await (
      isConsortiaRequest
        ? fetchConsortiumOrderLineHoldings(ky, stripes)
        : fetchOrderLineHoldings(ky)
    )(orderLinesResponse);

    const locationsResponse = await (
      isConsortiaRequest
        ? fetchConsortiumOrderLineLocations(ky, stripes)
        : fetchOrderLineLocations(ky)
    )(
      [
        ...orderLinesResponse,
        ...holdingsResponse
          .map(({ permanentLocationId: locationId }) => ({
            locations: [{ locationId }],
          })),
      ],
      {},
    );
    const linesOrdersResponse = await fetchLinesOrders(ky, orderLinesResponse, {});

    const locationsMap = locationsResponse.reduce((acc, locationItem) => {
      acc[locationItem.id] = locationItem;

      return acc;
    }, {});

    const holdingsMap = holdingsResponse.reduce((acc, holdingItem) => {
      acc[holdingItem.id] = holdingItem;

      return acc;
    }, {});

    const ordersMap = linesOrdersResponse.reduce((acc, order) => {
      acc[order.id] = order;

      return acc;
    }, {});

    const orderLinesMap = orderLinesResponse.reduce((acc, orderLine) => {
      acc[orderLine.id] = {
        ...orderLine,
        locations: orderLine.locations.map(({ locationId, holdingId }) => {
          const origLocation = locationsMap[locationId];
          const origHolding = holdingsMap[holdingId];

          if (origHolding) {
            return getHoldingLocationName(origHolding, locationsMap, invalidReferenceMessage);
          }

          return origLocation?.name ?? invalidReferenceMessage;
        }),
        orderWorkflow: ordersMap[orderLine.purchaseOrderId]?.workflowStatus,
      };

      return acc;
    }, {});

    return { orderLinesMap };
  }, [invalidReferenceMessage, isCentralOrderingEnabled, isTargetTenantCentral, stripes]);

  const { pagination, changePage } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const {
    isFetching,
    query,
    titles,
    totalRecords,
  } = useReceiving({
    pagination,
    fetchReferences,
    options: {
      tenantId: targetTenantId,
      enabled: Boolean(targetTenantId) && !isSearchModeLoading,
    },
  });

  const filtersStorageKey = `@folio/receiving/${isCentralOrderingEnabled && isTargetTenantCentral ? 'central/' : ''}filters`;

  return (
    <ReceivingList
      key={targetTenantId}
      onNeedMoreData={changePage}
      resetData={resetData}
      titlesCount={totalRecords}
      isLoading={isFetching}
      titles={titles}
      pagination={pagination}
      query={query}
      crossTenant={crossTenant}
      tenantId={targetTenantId}
      filtersStorageKey={filtersStorageKey}
    />
  );
};

export default ReceivingListContainer;
