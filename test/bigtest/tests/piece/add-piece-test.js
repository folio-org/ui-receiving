import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import {
  PieceFormInteractor,
  TitleDetailsInteractor,
} from '../../interactors';

describe('Add piece', () => {
  const titleDetails = new TitleDetailsInteractor();
  const pieceForm = new PieceFormInteractor();

  setupApplication();

  beforeEach(async function () {
    const location = this.server.create('location', { name: 'Test' });
    const line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
      locations: [{ locationId: location.id, quantity: 1, quantityPhysical: 1 }],
      checkinItems: true,
    });
    const title = this.server.create('title', {
      poLineId: line.id,
    });

    this.visit(`/receiving/${title.id}/view`);
    await titleDetails.whenLoaded();
  });

  it('should render title details pane', function () {
    expect(titleDetails.isPresent).to.be.true;
  });

  describe('open add piece modal', function () {
    beforeEach(async function () {
      await titleDetails.expectedPiecesAccordion.addPiece.click();
      await pieceForm.whenLoaded();
    });

    it('should open piece details modal with PO line location', function () {
      expect(pieceForm.isPresent).to.be.true;
      expect(pieceForm.location.options.list(1).text).to.include('Test');
    });

    describe('Unselect piece location', () => {
      beforeEach(async () => {
        await pieceForm.location.options.list(0).click();
      });

      it('piece location should not be selected', () => {
        expect(pieceForm.location.options.list(0).text).to.be.equal('');
      });
    });
  });
});
