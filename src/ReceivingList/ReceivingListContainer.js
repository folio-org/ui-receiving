import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import {
  getHoldingLocationName,
  RESULT_COUNT_INCREMENT,
  usePagination,
} from '@folio/stripes-acq-components';

import ReceivingList from './ReceivingList';

import { useReceivingSearchContext } from '../contexts';
import { useReceiving } from './hooks';
import {
  fetchLinesOrders,
  fetchOrderLineHoldings,
  fetchOrderLineLocations,
  fetchTitleOrderLines,
} from './utils';

const resetData = () => {};

const ReceivingListContainer = () => {
  const intl = useIntl();

  const {
    crossTenant,
    isCentralOrderingEnabled,
    isTargetTenantCentral,
    targetTenantId,
  } = useReceivingSearchContext();

  const invalidReferenceMessage = intl.formatMessage({ id: 'ui-receiving.titles.invalidReference' });

  const fetchReferences = useCallback(async (titles, ky) => {
    const l = await fetchTitleOrderLines(ky, titles, {});
    // TODO: remove: dev purposes
    const orderLinesResponse = l.filter(Boolean);
    const holdingsResponse = await fetchOrderLineHoldings(ky, orderLinesResponse);
    const locationsResponse = await fetchOrderLineLocations(
      ky,
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
            return getHoldingLocationName(origHolding, locationsMap);
          }

          return origLocation?.name ?? invalidReferenceMessage;
        }),
        orderWorkflow: ordersMap[orderLine.purchaseOrderId]?.workflowStatus,
      };

      return acc;
    }, {});

    return { orderLinesMap };
  }, [invalidReferenceMessage]);

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
      enabled: Boolean(targetTenantId),
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
