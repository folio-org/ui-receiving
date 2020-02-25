import React, { Fragment } from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { Callout } from '@folio/stripes/components';
import { ToastContext } from '@folio/stripes-acq-components';

import { ReceivingListContainer } from './ReceivingList';
import { TitleFormContainer } from './TitleForm';
import { TitleEditContainer } from './TitleEdit';
import { TitleReceiveContainer } from './TitleReceive';

const callout = React.createRef();

const Receiving = () => {
  return (
    <Fragment>
      <ToastContext.Provider value={callout}>
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
            component={ReceivingListContainer}
            path="/receiving"
          />
        </Switch>
      </ToastContext.Provider>
      <Callout ref={callout} />
    </Fragment>
  );
};

export default Receiving;
