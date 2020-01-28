import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

import { ButtonInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import {
  MODAL_SELECTOR,
  TIMEOUT,
} from './consts';

export default @interactor class ReceivingFormInteractor {
  static defaultScope = '#receiving-modal';

  receiveButton = new ButtonInteractor('[data-test-receive-piece]');

  isLoaded = isPresent(MODAL_SELECTOR);
  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
}
