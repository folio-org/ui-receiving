import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS, ORDER_STATUSES } from '@folio/stripes-acq-components';

import {
  ConfirmationInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

import setupApplication from '../../helpers/setup-application';
import {
  PieceFormInteractor,
  TitleDetailsInteractor,
} from '../../interactors';

describe('Add piece', () => {
  const titleDetails = new TitleDetailsInteractor();
  const pieceForm = new PieceFormInteractor();
  const receivingConfirmation = new ConfirmationInteractor('#confirm-receiving');

  setupApplication();

  beforeEach(async function () {
    const vendor = this.server.create('vendor');
    const order = this.server.create('order', {
      vendor: vendor.id,
      workflowStatus: ORDER_STATUSES.closed,
    });
    const location = this.server.create('location', { name: 'Test' });
    const line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
      locations: [{ locationId: location.id, quantity: 1, quantityPhysical: 1 }],
      checkinItems: true,
      purchaseOrderId: order.id,
      physical: {
        materialSupplier: vendor.id,
      },
    });
    const title = this.server.create('title', {
      poLineId: line.id,
    });

    this.visit(`/receiving/${title.id}/view`);

    const loadedPromise = await titleDetails.whenLoaded();

    return loadedPromise;
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

    describe('click quick receive button', () => {
      beforeEach(async () => {
        await pieceForm.receiveButton.click();
      });

      it('shows receiving confirmation modal', function () {
        expect(receivingConfirmation.isPresent).to.be.true;
      });

      describe('confirm receiving', function () {
        beforeEach(async function () {
          await receivingConfirmation.confirm();
          await titleDetails.whenLoaded();
        });

        it('shows Title details screen', function () {
          expect(pieceForm.isPresent).to.be.false;
          expect(receivingConfirmation.isPresent).to.be.false;
        });
      });
    });
  });
});
