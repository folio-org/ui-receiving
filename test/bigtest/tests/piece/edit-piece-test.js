import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import {
  PieceFormInteractor,
  TitleDetailsInteractor,
} from '../../interactors';
import { PIECE_FORMAT } from '../../../../src/common/constants';

describe('Edit piece', () => {
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
    });

    this.visit(`/receiving/${title.id}/view`);
    await titleDetails.whenLoaded();

    await titleDetails.expectedPiecesAccordion.pieces(0).click();
    await pieceForm.whenLoaded();
  });

  it('should open piece details modal', function () {
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
