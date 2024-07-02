import {
  Switch,
  Route,
} from 'react-router-dom';

import { LoadingPane } from '@folio/stripes/components';

import {
  RECEIVING_BIND_PIECES_ROUTE,
  RECEIVING_ROUTE,
  RECEIVING_ROUTE_CREATE,
  RECEIVING_ROUTE_EDIT,
  RECEIVING_ROUTE_EXPECT,
  RECEIVING_ROUTE_RECEIVE,
  RECEIVING_ROUTE_UNRECEIVE,
  ROUTING_LIST_ROUTE,
  CENTRAL_RECEIVING_BIND_PIECES_ROUTE,
  CENTRAL_RECEIVING_ROUTE,
  CENTRAL_RECEIVING_ROUTE_CREATE,
  CENTRAL_RECEIVING_ROUTE_EDIT,
  CENTRAL_RECEIVING_ROUTE_EXPECT,
  CENTRAL_RECEIVING_ROUTE_RECEIVE,
  CENTRAL_RECEIVING_ROUTE_UNRECEIVE,
  CENTRAL_ROUTING_LIST_ROUTE,
} from './constants';
import { useReceivingSearchContext } from './contexts';
import { ReceivingListContainer } from './ReceivingList';
import { TitleBindPiecesContainer } from './TitleBindPieces';
import { RoutingList } from './TitleDetails';
import { TitleFormContainer } from './TitleForm';
import { TitleEditContainer } from './TitleEdit';
import { TitleExpectContainer } from './TitleExpect';
import { TitleReceiveContainer } from './TitleReceive';
import { TitleUnreceiveContainer } from './TitleUnreceive';

export const ReceivingRoutes = () => {
  const {
    targetTenantId,
  } = useReceivingSearchContext();

  if (!targetTenantId) return <LoadingPane />;

  return (
    <Switch>
      <Route
        component={RoutingList}
        path={[CENTRAL_ROUTING_LIST_ROUTE, ROUTING_LIST_ROUTE]}
      />
      <Route
        path={[CENTRAL_RECEIVING_ROUTE_EDIT, RECEIVING_ROUTE_EDIT]}
        render={(props) => (
          <TitleEditContainer
            tenantId={targetTenantId}
            {...props}
          />
        )}
      />
      <Route
        path={[CENTRAL_RECEIVING_ROUTE_CREATE, RECEIVING_ROUTE_CREATE]}
        render={(props) => (
          <TitleFormContainer
            tenantId={targetTenantId}
            {...props}
          />
        )}
      />
      <Route
        path={[CENTRAL_RECEIVING_ROUTE_RECEIVE, RECEIVING_ROUTE_RECEIVE]}
        render={(props) => (
          <TitleReceiveContainer
            tenantId={targetTenantId}
            {...props}
          />
        )}
      />
      <Route
        path={[CENTRAL_RECEIVING_ROUTE_UNRECEIVE, RECEIVING_ROUTE_UNRECEIVE]}
        render={(props) => (
          <TitleUnreceiveContainer
            tenantId={targetTenantId}
            {...props}
          />
        )}
      />
      <Route
        component={TitleBindPiecesContainer}
        path={[CENTRAL_RECEIVING_BIND_PIECES_ROUTE, RECEIVING_BIND_PIECES_ROUTE]}
      />
      <Route
        component={TitleExpectContainer}
        path={[CENTRAL_RECEIVING_ROUTE_EXPECT, RECEIVING_ROUTE_EXPECT]}
      />
      <Route
        component={ReceivingListContainer}
        path={[CENTRAL_RECEIVING_ROUTE, RECEIVING_ROUTE]}
      />
    </Switch>
  );
};
