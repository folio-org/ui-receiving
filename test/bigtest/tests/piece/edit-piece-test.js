import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS, PIECE_FORMAT } from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import {
  PieceFormInteractor,
  TitleDetailsInteractor,
  TIMEOUT,
} from '../../interactors';

describe('Edit piece', function () {
  const titleDetails = new TitleDetailsInteractor();
  const pieceForm = new PieceFormInteractor();

  setupApplication();

  this.timeout(TIMEOUT);

  beforeEach(async function () {
    const vendor = this.server.create('vendor');
    const order = this.server.create('order', {
      vendor: vendor.id,
    });
    const line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
      purchaseOrderId: order.id,
      physical: {
        materialSupplier: vendor.id,
      },
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

    await titleDetails.expectedPiecesAccordion.pieces(0).click();

    const pieceFormLoaded = await pieceForm.whenLoaded();

    return pieceFormLoaded;
  });

  it('should open piece details modal', function () {
    expect(pieceForm.isPresent).to.be.true;
  });

  describe('after change enumeration and save piece', function () {
    beforeEach(async function () {
      await pieceForm.enumeration.fill('v1');
      await pieceForm.saveButton.click();
    });

    it('should close piece details modal', function () {
      expect(pieceForm.isPresent).to.be.false;
    });
  });
});
