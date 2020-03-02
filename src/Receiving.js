import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { ReceivingListContainer } from './ReceivingList';
import { TitleFormContainer } from './TitleForm';
import { TitleEditContainer } from './TitleEdit';
import { TitleReceiveContainer } from './TitleReceive';
import { TitleUnreceiveContainer } from './TitleUnreceive';

const Receiving = () => {
  return (
    <Switch>
      <Route
        path="/receiving/:id/edit"
        component={TitleEditContainer}
      />
      <Route
        component={TitleFormContainer}
        path="/receiving/create"
      />
      <Route
        component={TitleReceiveContainer}
        path="/receiving/receive/:id"
      />
      <Route
        component={TitleUnreceiveContainer}
        path="/receiving/unreceive/:id"
      />
      <Route
        component={ReceivingListContainer}
        path="/receiving"
      />
    </Switch>
  );
};

export default Receiving;
