import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import { TitleDetailsInteractor } from '../../interactors';

describe('Title details', () => {
  const titleDetails = new TitleDetailsInteractor();

  setupApplication();

  beforeEach(async function () {
    const line = this.server.create('line');
    const title = this.server.create('title', {
      poLineId: line.id,
    });

    this.visit(`/receiving/${title.id}/view`);
    await titleDetails.whenLoaded();
  });

  it('renders title details pane', () => {
    expect(titleDetails.isPresent).to.equal(true);
  });
});
