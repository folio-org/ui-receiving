import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { render, cleanup } from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { noop } from 'lodash';

import TitleReceive from './TitleReceive';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FieldInventory: jest.fn(() => 'FieldInventory'),
}));
jest.mock('../common/components/LineLocationsView/LineLocationsView', () => jest.fn().mockReturnValue('LineLocationsView'));

const title = 'The American Journal of Medicine';
const note = 'Test receiving note';
const initialValues = {
  receivedItems: [{
    barcode: '10001',
    enumeration: 'The American Journal of Medicine',
    id: '0001',
  }],
};
const poLine = { locations: [{ locationId: '001' }] };
const locations = [{ id: '001', name: 'Annex', code: 'AN' }];

const queryClient = new QueryClient();

const renderTitleReceive = ({ receivingNote, paneTitle }) => (render(
  <IntlProvider locale="en">
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <TitleReceive
          createInventoryValues={{}}
          initialValues={initialValues}
          instanceId="instanceId"
          locations={locations}
          poLine={poLine}
          onCancel={noop}
          onSubmit={noop}
          paneTitle={paneTitle}
          receivingNote={receivingNote}
        />
      </MemoryRouter>
    </QueryClientProvider>
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
      const { getByText } = renderTitleReceive({ receivingNote: note, paneTitle: title });

      expect(getByText(note)).toBeDefined();
    });
  });

  describe('When there is no receiving note - banner is not presented', () => {
    it('Receiving note banner is not presented', () => {
      const { queryByText } = renderTitleReceive({ receivingNote: null, paneTitle: title });

      expect(queryByText(note)).toBeNull();
    });
  });
});
