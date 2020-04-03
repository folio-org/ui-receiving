import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import setupApplication from '../helpers/setup-application';
import {
  TitleDetailsInteractor,
  TitlesListInteractor,
} from '../interactors';

const LIST_COUNT = 3;

describe('Titles list', () => {
  const listPage = new TitlesListInteractor();
  const titleDetails = new TitleDetailsInteractor();

  setupApplication();

  beforeEach(async function () {
    const line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
    });

    this.server.createList('title', LIST_COUNT, {
      poLineId: line.id,
    });
    this.visit('/receiving');
    await listPage.whenLoaded();
  });

  it('is no results message label present', () => {
    expect(listPage.isNoResultsMessageLabelPresent).to.be.true;
    expect(listPage.hasNewButton).to.be.true;
  });

  describe('search by poNumber', function () {
    beforeEach(async function () {
      await listPage.fillSearchField('test');
      await listPage.clickSearch();
      await listPage.whenListLoaded();
    });

    it('renders row for each title from response', () => {
      expect(listPage.isPresent).to.equal(true);
      expect(listPage.rows().length).to.be.equal(LIST_COUNT);
      expect(listPage.hasNewButton).to.be.true;
    });

    describe('clicking on the first title row', () => {
      beforeEach(async () => {
        await listPage.rows(0).click();
        await titleDetails.whenLoaded();
      });

      it('stays calm and shows details', () => {
        expect(listPage.isPresent).to.equal(true);
        expect(titleDetails.isPresent).to.equal(true);
      });
    });
  });
});
