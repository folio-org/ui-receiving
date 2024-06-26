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
  CentralOrderingContextProvider,
  handleKeyCommand,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { ReceivingSearchContextProvider } from './contexts';
import { ReceivingRoutes } from './ReceivingRoutes';

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
    <CentralOrderingContextProvider>
      <ReceivingSearchContextProvider>
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

            <ReceivingRoutes />
          </HasCommand>
        </CommandList>
        {isOpen && (
          <AcqKeyboardShortcutsModal
            commands={receivingCommands}
            onClose={toggleModal}
          />
        )}
      </ReceivingSearchContextProvider>
    </CentralOrderingContextProvider>
  );
};

export default Receiving;
