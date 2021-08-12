/* eslint-disable max-classes-per-file */
import {
  interactor,
  is,
  isPresent,
  value,
} from '@bigtest/interactor';

import {
  ButtonInteractor,
  OptionListInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

import {
  TIMEOUT,
} from './consts';

@interactor class EnumerationInput {
  static defaultScope = '[name="enumeration"]';
  isInput = is('input');
  value = value();
}

@interactor class LocationInteractor {
  options = new OptionListInteractor('#sl-field-locationId');
}

export default @interactor class PieceFormInteractor {
  static defaultScope = '#add-piece-modal';

  enumeration = new EnumerationInput();
  location = new LocationInteractor();
  cancelButton = new ButtonInteractor('[data-test-add-piece-cancel]');
  saveButton = new ButtonInteractor('[data-test-add-piece-save]');
  receiveButton = new ButtonInteractor('[data-test-add-piece-check-in]');
  addItemButton = new ButtonInteractor('[data-test-add-item]');

  isLoaded = isPresent('#add-piece-modal-content');
  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
}
