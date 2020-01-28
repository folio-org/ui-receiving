import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';
import { ConfirmationInteractor } from '@folio/stripes-acq-components/test/bigtest/interactors';

import setupApplication from '../../helpers/setup-application';
import { TitleDetailsInteractor } from '../../interactors';
import {
  PIECE_FORMAT,
  PIECE_STATUS,
} from '../../../../src/TitleDetails/constants';

describe('Unreceive piece', () => {
  const titleDetails = new TitleDetailsInteractor();

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
    await titleDetails.receivedPiecesAccordion.pieces(0).actions.click();
  });

  it('unreceive button is visible', function () {
    expect(titleDetails.receivedPiecesAccordion.unreceiveButton.isButton).to.be.true;
  });

  describe('click unreceive button', function () {
    const unreceiveConfirmation = new ConfirmationInteractor('#unreceive-piece-confirmation');

    beforeEach(async function () {
      await titleDetails.receivedPiecesAccordion.unreceiveButton.click();
    });

    it('unreceive piece confirmation is visible', function () {
      expect(unreceiveConfirmation.isPresent).to.be.true;
    });

    describe('click confirm button', function () {
      beforeEach(async function () {
        await unreceiveConfirmation.confirm();
      });

      it('closes unreceive confirmation modal', function () {
        expect(unreceiveConfirmation.isPresent).to.be.false;
      });
    });
  });
});
