import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import {
  ReceivingFormInteractor,
  TitleDetailsInteractor,
} from '../../interactors';
import { PIECE_FORMAT } from '../../../../src/common/constants';

describe('Edit piece', () => {
  const titleDetails = new TitleDetailsInteractor();
  const receivingForm = new ReceivingFormInteractor();

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
    await titleDetails.expectedPiecesAccordion.receiveButton.click();
  });

  it('receiving form is visible', function () {
    expect(receivingForm.isPresent).to.be.true;
  });

  describe('click receive button', function () {
    beforeEach(async function () {
      await receivingForm.receiveButton.click();
    });

    it('closes receiving modal', function () {
      expect(receivingForm.isPresent).to.be.false;
    });
  });
});
