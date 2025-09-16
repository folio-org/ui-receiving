import PropTypes from 'prop-types';
import {
  useCallback,
  useState,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { useOkapiKy } from '@folio/stripes/core';
import {
  LoadingPane,
  ORDER_PIECES_API,
  PIECE_STATUS,
  useOrderLine,
} from '@folio/stripes-acq-components';

import {
  useOrder,
  useOrganizationsBatch,
  useTitle,
} from '../common/hooks';
import {
  CENTRAL_RECEIVING_ROUTE,
  RECEIVING_ROUTE,
} from '../constants';
import { useReceivingSearchContext } from '../contexts';
import { EXPECTED_PIECES_SEARCH_VALUE } from '../Piece';
import TitleDetails from './TitleDetails';

const getVendorIds = (order, orderLine) => {
  return [...new Set([
    order?.vendor,
    orderLine?.physical?.materialSupplier,
    orderLine?.eresource?.accessProvider,
  ].filter(Boolean))];
};

const DEFAULT_DATA_OBJECT = {};

const TitleDetailsContainer = ({
  history,
  location,
  match,
  refreshList,
}) => {
  const titleId = match.params.id;

  const [isResourcesLoading, setIsResourcesLoading] = useState();

  const {
    isCentralOrderingEnabled,
    isCentralRouting,
    targetTenantId: tenantId,
  } = useReceivingSearchContext();

  const ky = useOkapiKy({ tenant: tenantId });

  const [piecesExistence, setPiecesExistence] = useState();
  const [vendorsMap, setVendorsMap] = useState({});

  const hasPieces = useCallback((lineId, status) => (
    ky.get(ORDER_PIECES_API, {
      searchParams: {
        limit: 1,
        query: `titleId==${titleId} and poLineId==${lineId} and receivingStatus==(${status})`,
      },
    })
      .json()
      .then(({ totalRecords }) => totalRecords)
      .catch(() => 0)
      .then((count) => ({ [status]: count }))
  ), [ky, titleId]);

  const fetchReceivingResources = useCallback((lineId) => {
    setIsResourcesLoading(true);
    setPiecesExistence();

    return Promise.all([
      hasPieces(lineId, EXPECTED_PIECES_SEARCH_VALUE),
      hasPieces(lineId, PIECE_STATUS.received),
      hasPieces(lineId, PIECE_STATUS.unreceivable),
    ])
      .then(existences => setPiecesExistence(existences.reduce(
        (acc, existence) => ({ ...acc, ...existence, key: new Date() }),
        {},
      )))
      .catch(() => setPiecesExistence({}))
      .finally(() => setIsResourcesLoading(false));
  }, [hasPieces]);

  /* Data fetching */

  const commonHookOptions = {
    tenantId,
    enabled: Boolean(tenantId),
  };

  const {
    isLoading: isTitleLoading,
    title,
  } = useTitle(titleId, commonHookOptions);

  const {
    isLoading: isOrderLineLoading,
    orderLine: poLine,
  } = useOrderLine(title?.poLineId, {
    ...commonHookOptions,
    onSuccess: (line) => fetchReceivingResources(line.id),
  });

  const {
    isLoading: isOrderLoading,
    order,
  } = useOrder(poLine?.purchaseOrderId, commonHookOptions);

  const { isLoading: isOrganizationsLoading } = useOrganizationsBatch(getVendorIds(order, poLine), {
    ...commonHookOptions,
    onSuccess: (organizations) => setVendorsMap(organizations.reduce((acc, v) => ({ ...acc, [v.id]: v.name }), {})),
  });

  /* --- */

  const onClose = useCallback(
    () => {
      history.push({
        pathname: isCentralRouting ? CENTRAL_RECEIVING_ROUTE : RECEIVING_ROUTE,
        search: location.search,
      });
    },
    [location.search, history, isCentralRouting],
  );

  const onEdit = useCallback(() => {
    if (title?.id) {
      history.push({
        pathname: `${isCentralRouting ? CENTRAL_RECEIVING_ROUTE : RECEIVING_ROUTE}/${title.id}/edit`,
        search: location.search,
      });
    }
  }, [history, isCentralRouting, title?.id, location.search]);

  const isDataLoading = (
    isTitleLoading
    || isOrderLineLoading
    || isOrderLoading
    || isOrganizationsLoading
    || !vendorsMap
    || !tenantId
  );

  if (isDataLoading) {
    return (
      <LoadingPane
        id="pane-title-details"
        onClose={onClose}
      />
    );
  }

  return (
    <TitleDetails
      crossTenant={isCentralOrderingEnabled}
      isLoading={isResourcesLoading}
      onClose={onClose}
      onEdit={onEdit}
      order={order || DEFAULT_DATA_OBJECT}
      piecesExistence={piecesExistence}
      poLine={poLine || DEFAULT_DATA_OBJECT}
      refreshList={refreshList}
      title={title || DEFAULT_DATA_OBJECT}
      vendorsMap={vendorsMap}
    />
  );
};

TitleDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  refreshList: PropTypes.func.isRequired,
};

export default TitleDetailsContainer;
