import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  ORDER_FORMATS,
  ORDER_STATUSES,
  PIECE_FORMAT,
} from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import {
  TitleDetailsInteractor,
  TitleReceiveInteractor,
} from '../../interactors';

describe('Title details', () => {
  const titleDetails = new TitleDetailsInteractor();
  const titleReceive = new TitleReceiveInteractor();

  setupApplication();

  beforeEach(async function () {
    const vendor = this.server.create('vendor');
    const order = this.server.create('order', {
      workflowStatus: ORDER_STATUSES.closed,
      closeReason: {
        reason: 'Reason for closure',
      },
      vendor: vendor.id,
    });
    const line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
      purchaseOrderId: order.id,
      details: {
        receivingNote: 'Receiving note',
      },
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
  });

  it('renders title details pane', () => {
    expect(titleDetails.isPresent).to.equal(true);
    expect(titleDetails.receiveButton.isPresent).to.be.true;
  });

  it('warning message with closing reason is shown', () => {
    expect(titleDetails.closingReasonMessage).to.be.true;
  });

  describe('click receive button', function () {
    beforeEach(async function () {
      await titleDetails.receiveButton.click();
      await titleReceive.whenLoaded();
    });

    it('shows Title receive screen with receiving note banner', function () {
      expect(titleReceive.isPresent).to.be.true;
      expect(titleReceive.receivingNote).to.be.true;
    });
  });

  describe('click on title', function () {
    beforeEach(async function () {
      await titleDetails.instanceLink();
    });

    it('goes to instance in inventory app', function () {
      expect(titleReceive.isPresent).to.be.false;
    });
  });

  describe('click on PO number', function () {
    beforeEach(async function () {
      await titleDetails.poLineLink();
    });

    it('goes to POL in orders app', function () {
      expect(titleReceive.isPresent).to.be.false;
    });
  });
});
