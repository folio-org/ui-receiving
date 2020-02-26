/* eslint-disable max-classes-per-file */
import {
  interactor,
  isPresent,
  clickable,
  collection,
} from '@bigtest/interactor';

import { ButtonInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import { TITLE_ACCORDION } from '../../../src/TitleDetails/constants';
import { TIMEOUT } from './consts';

@interactor class ExpectedPiecesAccordion {
  static defaultScope = `#${TITLE_ACCORDION.expected}`;
  clickAddPiece = clickable('[data-test-add-piece-button]');
  pieces = collection('[class*=mclRow---]', {
    actions: new ButtonInteractor('#expected-piece-action-menu'),
  });

  editButton = new ButtonInteractor('[data-test-button-edit-piece]');
}

@interactor class ReceivedPiecesAccordion {
  static defaultScope = `#${TITLE_ACCORDION.received}`;
  pieces = collection('[class*=mclRow---]', {
    actions: new ButtonInteractor('#received-piece-action-menu'),
  });

  unreceiveButton = new ButtonInteractor('[data-test-button-unreceive-piece]');
}

export default @interactor class TitleDetailsInteractor {
  static defaultScope = '#pane-title-details';

  expectedPiecesAccordion = new ExpectedPiecesAccordion();
  receivedPiecesAccordion = new ReceivedPiecesAccordion();
  receiveButton = new ButtonInteractor('[data-test-title-receive-button]');

  isLoaded = isPresent('#accordion-toggle-button-information');
  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
}
