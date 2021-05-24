import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import {
  ORDER_FORMATS,
  ORDER_STATUSES,
  PIECE_FORMAT,
} from '@folio/stripes-acq-components';

import {
  ConfirmationInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

import setupApplication from '../../helpers/setup-application';
import {
  TitleDetailsInteractor,
  TitleReceiveInteractor,
  TIMEOUT,
} from '../../interactors';

describe('Title details', function () {
  const titleDetails = new TitleDetailsInteractor();
  const titleReceive = new TitleReceiveInteractor();
  const receivingConfirmation = new ConfirmationInteractor('#confirm-receiving');
  const InventoryApp = () => (<div>Inventory</div>);
  const OrdersApp = () => (<div>Orders</div>);

  setupApplication({
    modules: [
      {
        type: 'app',
        name: '@folio/inventory',
        displayName: 'Inventory',
        route: '/inventory',
        module: InventoryApp,
      },
      {
        type: 'app',
        name: '@folio/orders',
        displayName: 'Orders',
        route: '/orders',
        module: OrdersApp,
      },
    ],
  });

  this.timeout(TIMEOUT);

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

    const titleDetailsLoaded = await titleDetails.whenLoaded();

    return titleDetailsLoaded;
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
    });

    it('shows receiving confirmation modal', function () {
      expect(receivingConfirmation.isPresent).to.be.true;
    });

    describe('confirm receiving', function () {
      beforeEach(async function () {
        await receivingConfirmation.confirm();
        await titleReceive.whenLoaded();
      });

      it('shows Title receive screen with receiving note banner', function () {
        expect(titleReceive.isPresent).to.be.true;
        expect(titleReceive.receivingNote).to.be.true;
        expect(receivingConfirmation.isPresent).to.be.false;
      });
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
