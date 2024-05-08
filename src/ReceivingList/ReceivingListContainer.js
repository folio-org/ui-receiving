import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import {
  checkIfUserInCentralTenant,
  stripesConnect,
  useStripes,
} from '@folio/stripes/core';
import {
  getHoldingLocationName,
  locationsManifest,
  RESULT_COUNT_INCREMENT,
  useCentralOrderingSettings,
  usePagination,
} from '@folio/stripes-acq-components';

import {
  titlesResource,
  orderLinesResource,
  ordersResource,
  holdingsResource,
} from '../common/resources';
import ReceivingList from './ReceivingList';

import { useReceiving } from './hooks';
import {
  fetchLinesOrders,
  fetchOrderLineHoldings,
  fetchOrderLineLocations,
  fetchTitleOrderLines,
} from './utils';

const resetData = () => {};

const ReceivingListContainer = ({ mutator }) => {
  const intl = useIntl();
  const stripes = useStripes();

  const invalidReferenceMessage = intl.formatMessage({ id: 'ui-receiving.titles.invalidReference' });

  const fetchReferences = useCallback(async titlesResponse => {
    const orderLinesResponse = await fetchTitleOrderLines(mutator.receivingListOrderLines, titlesResponse, {});
    const holdingsResponse = await fetchOrderLineHoldings(mutator.receivingListHoldings, orderLinesResponse);
    const locationsResponse = await fetchOrderLineLocations(
      mutator.receivingListLocations,
      [
        ...orderLinesResponse,
        ...holdingsResponse
          .map(({ permanentLocationId: locationId }) => ({
            locations: [{ locationId }],
          })),
      ],
      {},
    );
    const linesOrdersResponse = await fetchLinesOrders(mutator.lineOrders, orderLinesResponse, {});

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
  }, [
    invalidReferenceMessage,
    mutator.lineOrders,
    mutator.receivingListHoldings,
    mutator.receivingListLocations,
    mutator.receivingListOrderLines,
  ]);

  const { pagination, changePage } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const {
    isFetching,
    query,
    titles,
    totalRecords,
  } = useReceiving({ pagination, fetchReferences });

  const { enabled: isCentralOrderingEnabled } = useCentralOrderingSettings({
    enabled: checkIfUserInCentralTenant(stripes),
  });

  return (
    <ReceivingList
      onNeedMoreData={changePage}
      resetData={resetData}
      titlesCount={totalRecords}
      isLoading={isFetching}
      titles={titles}
      pagination={pagination}
      query={query}
      centralOrdering={isCentralOrderingEnabled}
    />
  );
};

ReceivingListContainer.manifest = Object.freeze({
  receivingListTitles: titlesResource,
  receivingListOrderLines: orderLinesResource,
  receivingListLocations: locationsManifest,
  receivingListHoldings: holdingsResource,
  lineOrders: ordersResource,
});

ReceivingListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(ReceivingListContainer);
