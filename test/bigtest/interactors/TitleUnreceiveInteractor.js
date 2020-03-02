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

export default @interactor class TitleUnreceiveInteractor {
  static defaultScope = '#pane-title-unreceive-list';

  cancelButton = new ButtonInteractor('[data-test-cancel-button]');
  unreceiveButton = new ButtonInteractor('[data-test-save-button]');
  pieces = collection('#title-unreceive-list [class*=mclRow---]', {
    checked: new CheckboxInteractor('[data-test-title-unreceive-checked]'),
  });

  isLoaded = isPresent('#title-unreceive-list');
  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
}
