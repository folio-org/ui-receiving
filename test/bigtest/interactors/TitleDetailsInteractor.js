/* eslint-disable max-classes-per-file */
import {
  interactor,
  Interactor,
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
  pieces = collection(`#${TITLE_ACCORDION.expected} [class*=mclRow---]`, ButtonInteractor);
}

@interactor class ReceivedPiecesAccordion {
  static defaultScope = `#${TITLE_ACCORDION.received}`;
  pieces = collection('[class*=mclRow---]');

  unreceiveButton = new Interactor('[data-test-title-unreceive-button]');
}

export default @interactor class TitleDetailsInteractor {
  static defaultScope = '#pane-title-details';

  expectedPiecesAccordion = new ExpectedPiecesAccordion();
  receivedPiecesAccordion = new ReceivedPiecesAccordion();
  receiveButton = new ButtonInteractor('[data-test-title-receive-button]');
  closingReasonMessage = isPresent('[data-test-message-banner]');
  instanceLink = clickable('[data-testid="titleInstanceLink"]');
  poLineLink = clickable('[data-testid="titlePOLineLink"]');

  isLoaded = isPresent('#accordion-toggle-button-information');
  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
}
