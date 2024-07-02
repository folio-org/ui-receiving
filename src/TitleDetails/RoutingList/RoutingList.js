import {
  Route,
  Switch,
} from 'react-router-dom';

import {
  RoutingListCreate,
  RoutingListEdit,
  RoutingListView,
} from '@folio/stripes-acq-components';

import {
  CENTRAL_ROUTING_LIST_ROUTE,
  ROUTING_LIST_ROUTE,
} from '../../constants';
import { useReceivingSearchContext } from '../../contexts';
import {
  CENTRAL_FALLBACK_ROUTE,
  CENTRAL_ROUTING_LIST_CREATE_ROUTE,
  CENTRAL_ROUTING_LIST_EDIT_ROUTE,
  CENTRAL_ROUTING_LIST_VIEW_ROUTE,
  FALLBACK_ROUTE,
  ROUTING_LIST_CREATE_ROUTE,
  ROUTING_LIST_EDIT_ROUTE,
  ROUTING_LIST_VIEW_ROUTE,
} from './constants';

export function RoutingList() {
  const { isCentralRouting } = useReceivingSearchContext();

  const fallbackPath = isCentralRouting
    ? CENTRAL_FALLBACK_ROUTE
    : FALLBACK_ROUTE;
  const routingListUrl = isCentralRouting
    ? CENTRAL_ROUTING_LIST_ROUTE
    : ROUTING_LIST_ROUTE;

  return (
    <Switch>
      <Route
        path={[CENTRAL_ROUTING_LIST_CREATE_ROUTE, ROUTING_LIST_CREATE_ROUTE]}
        render={() => <RoutingListCreate fallbackPath={fallbackPath} />}
      />
      <Route
        path={[CENTRAL_ROUTING_LIST_VIEW_ROUTE, ROUTING_LIST_VIEW_ROUTE]}
        render={() => (
          <RoutingListView
            fallbackPath={fallbackPath}
            routingListUrl={routingListUrl}
          />
        )}
      />
      <Route
        path={[CENTRAL_ROUTING_LIST_EDIT_ROUTE, ROUTING_LIST_EDIT_ROUTE]}
        render={() => <RoutingListEdit fallbackPath={fallbackPath} />}
      />
    </Switch>
  );
}
