import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { ReceivingListContainer } from './ReceivingList';

const Receiving = () => {
  return (
    <Switch>
      <Route component={ReceivingListContainer} />
    </Switch>
  );
};

export default Receiving;
