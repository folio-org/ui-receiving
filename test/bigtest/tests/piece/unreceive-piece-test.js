import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  ORDER_FORMATS,
  PIECE_FORMAT,
  PIECE_STATUS,
} from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import { TitleDetailsInteractor } from '../../interactors';

describe('Unreceive piece', () => {
  const titleDetails = new TitleDetailsInteractor();

  setupApplication();

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
      receivingStatus: PIECE_STATUS.received,
    });

    this.visit(`/receiving/${title.id}/view`);
    await titleDetails.whenLoaded();
  });

  it('unreceive button is visible', function () {
    expect(titleDetails.receivedPiecesAccordion.unreceiveButton.isPresent).to.be.true;
  });
});
