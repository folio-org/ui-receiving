import {
  Switch,
  Route,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { AppContextMenu } from '@folio/stripes/core';
import {
  checkScope,
  CommandList,
  defaultKeyboardShortcuts,
  HasCommand,
  NavList,
  NavListItem,
  NavListSection,
} from '@folio/stripes/components';
import {
  AcqKeyboardShortcutsModal,
  handleKeyCommand,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { ReceivingListContainer } from './ReceivingList';
import { TitleFormContainer } from './TitleForm';
import { TitleEditContainer } from './TitleEdit';
import { TitleExpectContainer } from './TitleExpect';
import { TitleReceiveContainer } from './TitleReceive';
import { TitleUnreceiveContainer } from './TitleUnreceive';

const receivingCommands = [
  {
    name: 'receive',
    shortcut: 'mod + alt + r',
    label: <FormattedMessage id="ui-receiving.shortcut.receive" />,
  },
  {
    name: 'saveAndCreateAnother',
    shortcut: 'alt + s',
    label: <FormattedMessage id="ui-receiving.shortcut.piece.saveAndCreateAnother" />,
  },
];
const shortcutCommands = [...receivingCommands, ...defaultKeyboardShortcuts];

const Receiving = () => {
  const [isOpen, toggleModal] = useModalToggle();
  const focusSearchField = () => {
    const el = document.getElementById('input-record-search');

    if (el) {
      el.focus();
    }
  };

  const shortcuts = [
    {
      name: 'search',
      handler: handleKeyCommand(focusSearchField),
    },
    {
      name: 'openShortcutModal',
      shortcut: 'mod+alt+k',
      handler: handleKeyCommand(toggleModal),
    },
  ];

  return (
    <>
      <CommandList commands={shortcutCommands}>
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <AppContextMenu>
            {handleToggle => (
              <NavList>
                <NavListSection>
                  <NavListItem
                    id="receiving-app-search-item"
                    to={{
                      pathname: '/receiving',
                      state: { resetFilters: true },
                    }}
                    onClick={() => {
                      handleToggle();
                      focusSearchField();
                    }}
                  >
                    <FormattedMessage id="ui-receiving.appMenu.receivingAppSearch" />
                  </NavListItem>
                  <NavListItem
                    id="keyboard-shortcuts-item"
                    onClick={() => {
                      handleToggle();
                      toggleModal();
                    }}
                  >
                    <FormattedMessage id="stripes-acq-components.appMenu.keyboardShortcuts" />
                  </NavListItem>
                </NavListSection>
              </NavList>
            )}
          </AppContextMenu>
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
              component={TitleExpectContainer}
              path="/receiving/expect/:id"
            />
            <Route
              component={ReceivingListContainer}
              path="/receiving"
            />
          </Switch>
        </HasCommand>
      </CommandList>
      {isOpen && (
        <AcqKeyboardShortcutsModal
          commands={receivingCommands}
          onClose={toggleModal}
        />
      )}
    </>
  );
};

export default Receiving;
