import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import { TitlesListInteractor } from '../interactors';

const LIST_COUNT = 3;

describe('Titles list', () => {
  const listPage = new TitlesListInteractor();

  setupApplication();

  beforeEach(function () {
    this.server.createList('title', LIST_COUNT);
    this.visit('/receiving');
  });

  it('renders row for each title from response', () => {
    expect(listPage.isPresent).to.equal(true);
    expect(listPage.rows().length).to.be.equal(LIST_COUNT);
    expect(listPage.hasNewButton).to.be.true;
  });

  describe('clicking on the first title row', () => {
    beforeEach(async () => {
      await listPage.rows(0).click();
    });

    it('stays calm', () => {
      expect(listPage.isPresent).to.equal(true);
    });
  });
});
