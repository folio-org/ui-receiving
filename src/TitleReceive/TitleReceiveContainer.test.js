import React from 'react';
import { act, render, cleanup, screen } from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import {
  useReceive,
} from '../common/hooks';
import TitleReceiveContainer from './TitleReceiveContainer';
import TitleReceive from './TitleReceive';

jest.mock('../common/hooks', () => ({
  useReceive: jest.fn().mockReturnValue({}),
}));
jest.mock('./TitleReceive', () => jest.fn().mockReturnValue('TitleReceive'));

const mockTitle = { title: 'Title', id: '001', poLineId: '002', instanceId: 'instanceId' };
const mockPoLine = { id: '002', locations: [{ locationId: '1' }] };
const mockPieces = [{ id: '01', locationId: '1' }];
const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  push: jest.fn(),
  replace: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
  location: locationMock,
};

const renderTitleReceiveContainer = (mutator) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <TitleReceiveContainer
        history={historyMock}
        location={locationMock}
        match={{ params: { id: '001' }, path: 'path', url: 'url' }}
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
        GET: jest.fn().mockReturnValue(Promise.resolve(mockTitle)),
      },
      pieces: {
        GET: jest.fn().mockReturnValue(Promise.resolve(mockPieces)),
      },
      piece: {
        POST: jest.fn(),
      },
      poLine: {
        GET: jest.fn().mockReturnValue(Promise.resolve(mockPoLine)),
      },
      locations: {
        GET: jest.fn().mockReturnValue(Promise.resolve([])),
        reset: jest.fn(),
      },
      requests: {
        GET: jest.fn(),
        reset: jest.fn(),
      },
      items: {
        GET: jest.fn(),
        reset: jest.fn(),
      },
    };

    TitleReceive.mockClear();
    historyMock.push.mockClear();
  });

  afterEach(cleanup);

  it('should display title receive', async () => {
    await act(async () => {
      renderTitleReceiveContainer(mutator);
    });

    expect(screen.getByText('TitleReceive')).toBeDefined();
  });

  it('should load only title data', async () => {
    const title = { name: 'Title', id: '001' };

    mutator.title.GET.mockReturnValue(Promise.resolve(title));

    await act(async () => {
      renderTitleReceiveContainer(mutator);
    });

    expect(mutator.title.GET).toHaveBeenCalled();
    expect(mutator.pieces.GET).not.toHaveBeenCalled();
    expect(mutator.poLine.GET).not.toHaveBeenCalled();
    expect(mutator.requests.GET).not.toHaveBeenCalled();
    expect(mutator.items.GET).not.toHaveBeenCalled();
  });

  it('should load locations data after mounted', async () => {
    const title = { name: 'Title', id: '001' };

    mutator.title.GET.mockReturnValue(Promise.resolve(title));

    await act(async () => {
      renderTitleReceiveContainer(mutator);
    });

    expect(mutator.locations.GET).toHaveBeenCalled();
  });

  it('should load all data', async () => {
    await act(async () => {
      renderTitleReceiveContainer(mutator);
    });

    expect(mutator.title.GET).toHaveBeenCalled();
    expect(mutator.pieces.GET).toHaveBeenCalled();
    expect(mutator.poLine.GET).toHaveBeenCalled();
    expect(mutator.locations.GET).toHaveBeenCalled();
  });

  it('should redirect to title details when receive is cancelled', async () => {
    await act(async () => renderTitleReceiveContainer(mutator));

    TitleReceive.mock.calls[0][0].onCancel();

    expect(historyMock.push).toHaveBeenCalled();
  });

  it('should receive pieces', async () => {
    const receiveMock = jest.fn().mockReturnValue(Promise.resolve());

    useReceive.mockClear().mockReturnValue({ receive: receiveMock });

    await act(async () => renderTitleReceiveContainer(mutator));

    TitleReceive.mock.calls[0][0].onSubmit({ receivedItems: [{ checked: true, isCreateItem: true }] });

    expect(receiveMock).toHaveBeenCalled();
  });
});
