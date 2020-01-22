import {
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

export default @interactor class TitlesListInteractor {
  static defaultScope = '[data-test-titles-list]';
  hasNewButton = isPresent('#clickable-new-title');
  rows = collection('[role=group] [role=row]');
}
