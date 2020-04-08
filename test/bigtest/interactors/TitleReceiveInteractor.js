import {
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import {
  ButtonInteractor,
  CheckboxInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

import { TIMEOUT } from './consts';

@interactor class OpenedRequestModal {
  closeButton = new ButtonInteractor('[data-test-close-opened-requests-modal-button]');
}

export default @interactor class TitleReceiveInteractor {
  static defaultScope = '#pane-title-receive-list';

  cancelButton = new ButtonInteractor('[data-test-cancel-button]');
  receiveButton = new ButtonInteractor('[data-test-save-button]');
  pieces = collection('#title-receive-list [class*=mclRow---]', {
    checked: new CheckboxInteractor('[data-test-title-receive-checked]'),
  });
  receivingNote = isPresent('[data-test-message-banner]');

  openedRequestModal = new OpenedRequestModal('#data-test-opened-requests-modal');
  isLoaded = isPresent('#title-receive-list');
  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
}
