import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { ReceivingListContainer } from './ReceivingList';
import { TitleFormContainer } from './TitleForm';

const Receiving = ({ match }) => {
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

Receiving.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default Receiving;
