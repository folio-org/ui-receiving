import {
  Route,
  Switch,
} from 'react-router-dom';

import {
  RoutingListCreate,
  RoutingListEdit,
  RoutingListView,
} from '@folio/stripes-acq-components';

import { ROUTING_LIST_ROUTE } from '../../constants';
import {
  FALLBACK_ROUTE,
  ROUTING_LIST_CREATE_ROUTE,
  ROUTING_LIST_EDIT_ROUTE,
  ROUTING_LIST_VIEW_ROUTE,
} from './constants';

export function RoutingList() {
  return (
    <Switch>
      <Route
        path={ROUTING_LIST_CREATE_ROUTE}
        render={() => <RoutingListCreate fallbackPath={FALLBACK_ROUTE} />}
      />
      <Route
        path={ROUTING_LIST_VIEW_ROUTE}
        render={() => (
          <RoutingListView
            fallbackPath={FALLBACK_ROUTE}
            routingListUrl={ROUTING_LIST_ROUTE}
          />
        )}
      />
      <Route
        path={ROUTING_LIST_EDIT_ROUTE}
        render={() => <RoutingListEdit fallbackPath={FALLBACK_ROUTE} />}
      />
    </Switch>
  );
}
