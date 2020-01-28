import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import {
  PieceFormInteractor,
  TitleDetailsInteractor,
} from '../../interactors';
import { PIECE_FORMAT } from '../../../../src/TitleDetails/constants';

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
    await titleDetails.expectedPiecesAccordion.pieces(0).actions.click();
  });

  it('edit button is visible', function () {
    expect(titleDetails.expectedPiecesAccordion.editButton.isButton).to.be.true;
  });

  describe('click edit button', function () {
    beforeEach(async function () {
      await titleDetails.expectedPiecesAccordion.editButton.click();
    });

    it('piece details modal is visible', function () {
      expect(pieceForm.isPresent).to.be.true;
    });

    describe('change caption and save piece', function () {
      beforeEach(async function () {
        await pieceForm.caption.fill('Test caption');
        await pieceForm.saveButton.click();
      });

      it('piece details modal is not visible', function () {
        expect(pieceForm.isPresent).to.be.false;
      });
    });
  });
});
