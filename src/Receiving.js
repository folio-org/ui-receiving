import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { ReceivingListContainer } from './ReceivingList';
import { TitleFormContainer } from './TitleForm';

const Receiving = () => {
  return (
    <Switch>
      <Route
        component={TitleFormContainer}
        path="/receiving/create"
      />
      <Route
        component={ReceivingListContainer}
        path="/receiving"
      />
    </Switch>
  );
};

export default Receiving;
