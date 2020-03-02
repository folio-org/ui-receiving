import {
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import { TIMEOUT } from './consts';

export default @interactor class TitlesListInteractor {
  static defaultScope = '[data-test-titles-list]';
  hasNewButton = isPresent('#clickable-new-title');
  rows = collection('[role=group] [role=row]');
  isLoaded = isPresent('#receivings-list');

  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
}
