import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS, PIECE_FORMAT } from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import {
  TitleUnreceiveInteractor,
  TitleDetailsInteractor,
} from '../../interactors';

describe('Unreceive pieces', () => {
  const titleDetails = new TitleDetailsInteractor();
  const titleUnreceive = new TitleUnreceiveInteractor();

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

    this.visit(`/receiving/unreceive/${title.id}`);
    await titleUnreceive.whenLoaded();
  });

  it('Unreceive title screen is visible', function () {
    expect(titleUnreceive.isPresent).to.be.true;
    expect(titleUnreceive.unreceiveButton.isDisabled).to.be.true;
  });

  describe('click Cancel button', function () {
    beforeEach(async function () {
      await titleUnreceive.cancelButton.click();
      await titleDetails.whenLoaded();
    });

    it('returns to Title details pane', function () {
      expect(titleDetails.isPresent).to.be.true;
    });
  });

  describe('click Unreceive button', function () {
    beforeEach(async function () {
      await titleUnreceive.pieces(0).checked.clickAndBlur();
      await titleUnreceive.unreceiveButton.click();
      await titleDetails.whenLoaded();
    });

    it('returns to Title details pane', function () {
      expect(titleDetails.isPresent).to.be.true;
    });
  });
});
