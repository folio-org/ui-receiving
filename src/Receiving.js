import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import {
  checkScope,
  CommandList,
  defaultKeyboardShortcuts,
  HasCommand,
} from '@folio/stripes/components';

import { ReceivingListContainer } from './ReceivingList';
import { TitleFormContainer } from './TitleForm';
import { TitleEditContainer } from './TitleEdit';
import { TitleReceiveContainer } from './TitleReceive';
import { TitleUnreceiveContainer } from './TitleUnreceive';

const Receiving = () => {
  const focusSearchField = () => {
    const el = document.getElementById('input-record-search');

    if (el) {
      el.focus();
    }
  };

  const shortcuts = [
    {
      name: 'search',
      handler: focusSearchField,
    },
  ];

  return (
    <CommandList commands={defaultKeyboardShortcuts}>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
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
      </HasCommand>
    </CommandList>
  );
};

export default Receiving;
