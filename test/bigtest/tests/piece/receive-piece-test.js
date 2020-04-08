import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import {
  TitleReceiveInteractor,
  TitleDetailsInteractor,
} from '../../interactors';
import { PIECE_FORMAT } from '../../../../src/common/constants';

describe('Receive piece', () => {
  const titleDetails = new TitleDetailsInteractor();
  const titleReceive = new TitleReceiveInteractor();

  setupApplication();

  beforeEach(async function () {
    const item = this.server.create('item');
    const line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
    });
    const title = this.server.create('title', {
      poLineId: line.id,
    });

    this.server.create('request', { itemId: item.id });
    this.server.create('piece', {
      poLineId: line.id,
      format: PIECE_FORMAT.physical,
      itemId: item.id,
    });

    this.visit(`/receiving/receive/${title.id}`);
    await titleReceive.whenLoaded();
  });

  it('receiving screen is visible', function () {
    expect(titleReceive.isPresent).to.be.true;
    expect(titleReceive.receiveButton.isDisabled).to.be.true;
    expect(titleReceive.receivingNote).to.be.false;
  });

  describe('click Cancel button', function () {
    beforeEach(async function () {
      await titleReceive.cancelButton.click();
      await titleDetails.whenLoaded();
    });

    it('returns to Title details pane', function () {
      expect(titleDetails.isPresent).to.be.true;
    });
  });

  describe('click Receive button', function () {
    beforeEach(async function () {
      await titleReceive.pieces(0).checked.clickAndBlur();
      await titleReceive.receiveButton.click();
    });

    it('shows Opened Requests modal', function () {
      expect(titleReceive.openedRequestModal.isPresent).to.be.true;
    });

    describe('close Opened Request modal', function () {
      beforeEach(async function () {
        await titleReceive.openedRequestModal.closeButton.click();
        await titleDetails.whenLoaded();
      });

      it('returns to Title details pane', function () {
        expect(titleDetails.isPresent).to.be.true;
      });
    });
  });
});
