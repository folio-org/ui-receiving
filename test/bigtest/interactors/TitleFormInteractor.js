import {
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import { TextFieldInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

export default @interactor class TitleFormInteractor {
  static defaultScope = '#pane-title-form';
  publisher = new TextFieldInteractor('[name="publisher"]');

  isLoaded = isPresent('#accordion-toggle-button-itemDetails');
  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
}
