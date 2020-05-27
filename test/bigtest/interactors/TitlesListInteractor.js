import {
  clickable,
  collection,
  fillable,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import { TIMEOUT } from './consts';

export default @interactor class TitlesListInteractor {
  static defaultScope = '[data-test-titles-list]';
  hasNewButton = isPresent('#clickable-new-title');
  rows = collection('[data-row-inner]');
  isLoaded = isPresent('[data-test-results-pane]');
  isNoResultsMessageLabelPresent = isPresent('[class*=noResultsMessage---]');
  fillSearchField = fillable('#input-record-search');
  clickSearch = clickable('[data-test-single-search-form-submit]');

  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }

  whenListLoaded() {
    return this.timeout(TIMEOUT).when(() => isPresent('#receivings-list'));
  }
}
