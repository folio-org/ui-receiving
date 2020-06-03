import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS, PIECE_FORMAT, PIECE_STATUS } from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import {
  PieceFormInteractor,
  TitleDetailsInteractor,
} from '../../interactors';

describe('Edit received piece', () => {
  const titleDetails = new TitleDetailsInteractor();
  const pieceForm = new PieceFormInteractor();

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
      receivingStatus: PIECE_STATUS.received,
    });

    this.visit(`/receiving/${title.id}/view`);
    await titleDetails.whenLoaded();

    await titleDetails.receivedPiecesAccordion.pieces(0).click();
    await pieceForm.whenLoaded();
  });

  it('should open Edit piece modal', function () {
    expect(pieceForm.isPresent).to.be.true;
  });

  describe('after change caption and save piece', function () {
    beforeEach(async function () {
      await pieceForm.caption.fill('Test caption');
      await pieceForm.saveButton.click();
    });

    it('should close piece details modal', function () {
      expect(pieceForm.isPresent).to.be.false;
    });
  });
});
