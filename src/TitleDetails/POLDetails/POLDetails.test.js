import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import POLDetails from './POLDetails';

const renderPOLDetails = ({
  poLineId,
  poLineNumber,
  receiptDate,
  receivingNote,
}) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <POLDetails
        poLineId={poLineId}
        poLineNumber={poLineNumber}
        receiptDate={receiptDate}
        receivingNote={receivingNote}
      />
    </MemoryRouter>
  </IntlProvider>,
));

const polDetails = {
  poLineId: '001',
  poLineNumber: 'POL-001',
  receiptDate: '2021-02-06',
  receivingNote: 'critical',
};

describe('Given POL details', () => {
  afterEach(cleanup);

  it('Than it should display PO Line values', () => {
    const { getByText } = renderPOLDetails(polDetails);

    expect(getByText(polDetails.poLineNumber)).toBeDefined();
    expect(getByText(polDetails.receiptDate)).toBeDefined();
    expect(getByText(polDetails.receivingNote)).toBeDefined();
  });

  describe('When title is connected with poLine', () => {
    it('Than it should display POL number as a link', () => {
      const { queryByTestId } = renderPOLDetails(polDetails);

      expect(queryByTestId('titlePOLineLink')).not.toEqual(null);
    });
  });
});
