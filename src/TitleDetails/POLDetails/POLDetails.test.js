import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import POLDetails from './POLDetails';

const renderPOLDetails = ({
  accessProvider,
  materialSupplier,
  orderFormat,
  orderType,
  poLineId,
  poLineNumber,
  receiptDate,
  receivingNote,
  vendor,
}) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <POLDetails
        accessProvider={accessProvider}
        materialSupplier={materialSupplier}
        orderFormat={orderFormat}
        orderType={orderType}
        poLineId={poLineId}
        poLineNumber={poLineNumber}
        receiptDate={receiptDate}
        receivingNote={receivingNote}
        vendor={vendor}
      />
    </MemoryRouter>
  </IntlProvider>,
));

const polDetails = {
  accessProvider: 'Access provider',
  materialSupplier: 'Material supplier',
  orderFormat: 'P/E Mix',
  orderType: 'Ongoing',
  poLineId: '001',
  poLineNumber: 'POL-001',
  receiptDate: '2021-02-06',
  receivingNote: 'critical',
  vendor: 'Vendor',
};

describe('Given POL details', () => {
  afterEach(cleanup);

  it('Than it should display PO Line values', () => {
    const { getByText } = renderPOLDetails(polDetails);

    expect(getByText(polDetails.poLineNumber)).toBeDefined();
    expect(getByText(polDetails.receiptDate)).toBeDefined();
    expect(getByText(polDetails.receivingNote)).toBeDefined();
    expect(getByText(polDetails.accessProvider)).toBeDefined();
    expect(getByText(polDetails.materialSupplier)).toBeDefined();
    expect(getByText('ui-receiving.title.orderType.Ongoing')).toBeDefined();
    expect(getByText(polDetails.vendor)).toBeDefined();
  });

  describe('When title is connected with poLine', () => {
    it('Than it should display POL number as a link', () => {
      const { queryByTestId } = renderPOLDetails(polDetails);

      expect(queryByTestId('titlePOLineLink')).not.toEqual(null);
    });
  });
});
