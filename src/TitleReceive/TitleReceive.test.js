import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { noop } from 'lodash';

import '@folio/stripes-acq-components/test/jest/__mock__';

import TitleReceive from './TitleReceive';

const title = 'The American Journal of Medicine';
const note = 'Test receiving note';
const initialValues = {
  receivedItems: [{
    barcode: '10001',
    caption: 'The American Journal of Medicine',
    id: '0001',
  }],
};
const poLineLocationIds = ['001'];
const locations = [{ id: '001' }];

const renderTitleReceive = ({ receivingNote, paneTitle }) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <TitleReceive
        createInventoryValues={{}}
        initialValues={initialValues}
        instanceId="instanceId"
        locations={locations}
        poLineLocationIds={poLineLocationIds}
        onCancel={noop}
        onSubmit={noop}
        paneTitle={paneTitle}
        receivingNote={receivingNote}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('Receiving title', () => {
  afterEach(cleanup);

  it('should display title', () => {
    const { getByText } = renderTitleReceive({ paneTitle: title });

    expect(getByText(title)).toBeDefined();
  });

  describe('When there is receiving note - banner is presented', () => {
    it('it should display receiving note banner', () => {
      const { getByText } = renderTitleReceive({ receivingNote: note });

      expect(getByText(note)).toBeDefined();
    });
  });

  describe('When there is no receiving note - banner is not presented', () => {
    it('Receiving note banner is not presented', () => {
      const { queryByText } = renderTitleReceive({ receivingNote: null });

      expect(queryByText(note)).toBeNull();
    });
  });
});
