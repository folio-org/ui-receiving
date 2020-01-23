import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import { TitleFormInteractor } from '../../interactors';

describe('New title screen test', () => {
  const formPage = new TitleFormInteractor();

  setupApplication();

  beforeEach(async function () {
    this.visit('/receiving/create');
    await formPage.whenLoaded();
  });

  it('renders form', () => {
    expect(formPage.isPresent).to.equal(true);
  });

  describe('fill the field', () => {
    beforeEach(async () => {
      await formPage.publisher.fill('test publisher');
    });

    it('stays calm', () => {
      expect(formPage.isPresent).to.equal(true);
    });
  });
});
