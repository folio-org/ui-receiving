import React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import '@folio/stripes-acq-components/test/jest/__mock__';

import TitleReceiveContainer from './TitleReceiveContainer';

const renderTitleReceiveContainer = (mutator) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <TitleReceiveContainer
        history={{}}
        location={{}}
        match={{ params: { id: '001' } }}
        mutator={mutator}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('TitleReceiveContainer', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      title: {
        GET: jest.fn(),
      },
      pieces: {
        GET: jest.fn(),
      },
      poLine: {
        GET: jest.fn(),
      },
      pieceLocations: {
        GET: jest.fn(),
        reset: jest.fn(),
      },
    };
  });

  afterEach(cleanup);

  it('should load only title data', async () => {
    const title = { name: 'Title', id: '001' };

    mutator.title.GET.mockReturnValue(Promise.resolve(title));

    await act(async () => {
      renderTitleReceiveContainer(mutator);
    });

    expect(mutator.title.GET).toHaveBeenCalled();
    expect(mutator.pieces.GET).not.toHaveBeenCalled();
    expect(mutator.poLine.GET).not.toHaveBeenCalled();
    expect(mutator.pieceLocations.GET).not.toHaveBeenCalled();
  });

  it('should load all data', async () => {
    const title = { title: 'Title', id: '001', poLineId: '002' };
    const poLine = { id: '002', locations: [{ locationId: '1' }] };
    const pieces = [{ id: '01', locationId: '1' }];
    const locations = [{ id: '1' }];

    mutator.title.GET.mockReturnValue(Promise.resolve(title));
    mutator.poLine.GET.mockReturnValue(Promise.resolve(poLine));
    mutator.pieces.GET.mockReturnValue(Promise.resolve(pieces));
    mutator.pieceLocations.GET.mockReturnValue(Promise.resolve(locations));

    await act(async () => {
      renderTitleReceiveContainer(mutator);
    });

    expect(mutator.title.GET).toHaveBeenCalled();
    expect(mutator.pieces.GET).toHaveBeenCalled();
    expect(mutator.poLine.GET).toHaveBeenCalled();
    expect(mutator.pieceLocations.GET).toHaveBeenCalled();
  });
});
