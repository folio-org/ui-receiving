import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import { PIECE_FORMAT } from '../../../../src/common/constants';
import setupApplication from '../../helpers/setup-application';
import {
  TitleDetailsInteractor,
  TitleReceiveInteractor,
} from '../../interactors';

describe('Title details', () => {
  const titleDetails = new TitleDetailsInteractor();
  const titleReceive = new TitleReceiveInteractor();

  setupApplication();

  beforeEach(async function () {
    const line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
    });
    const title = this.server.create('title', {
      poLineId: line.id,
    });

    this.server.create('piece', {
      poLineId: line.id,
      format: PIECE_FORMAT.physical,
    });

    this.visit(`/receiving/${title.id}/view`);
    await titleDetails.whenLoaded();
  });

  it('renders title details pane', () => {
    expect(titleDetails.isPresent).to.equal(true);
    expect(titleDetails.receiveButton.isPresent).to.be.true;
  });

  describe('click receive button', function () {
    beforeEach(async function () {
      await titleDetails.receiveButton.click();
      await titleReceive.whenLoaded();
    });

    it('shows Title receive screen', function () {
      expect(titleReceive.isPresent).to.be.true;
    });
  });
});
