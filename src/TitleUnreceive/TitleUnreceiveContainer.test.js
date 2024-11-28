import React from 'react';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useTitleHydratedPieces } from '../common/hooks';
import TitleUnreceiveContainer from './TitleUnreceiveContainer';
import TitleUnreceive from './TitleUnreceive';

jest.mock('../../common/hooks', () => ({
  useTitleHydratedPieces: jest.fn(),
}));

jest.mock('./TitleUnreceive', () => jest.fn().mockReturnValue('TitleUnreceive'));

const mockTitle = { title: 'Title', id: '001', poLineId: '002' };
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
const mutatorMock = {
  unreceive: {
    POST: jest.fn().mockReturnValue(Promise.resolve({ receivingResults: [] })),
  },
};

const renderTitleUnreceiveContainer = () => render(
  <TitleUnreceiveContainer
    history={historyMock}
    location={locationMock}
    match={{ params: { id: '001' }, path: 'path', url: 'url' }}
    mutator={mutatorMock}
  />,
  { wrapper: MemoryRouter },
);

describe('TitleUnreceiveContainer', () => {
  let mutator;

  beforeEach(() => {
    TitleUnreceive.mockClear();
    historyMock.push.mockClear();
    useTitleHydratedPieces.mockClear().mockReturnValue({
      pieces: mockPieces,
      title: mockTitle,
      orderLine: mockPoLine,
      isLoading: false,
      locations: [{ id: '1', name: 'location1' }],
      holdings: [{ id: '1', name: 'holding1' }],
      pieceHoldingMap: { '01': '1' },
      pieceLocationMap: { '01': '1' },
    });
  });

  it('should display title unreceive', async () => {
    await act(async () => {
      renderTitleUnreceiveContainer();
    });

    expect(screen.getByText('TitleUnreceive')).toBeDefined();
  });

  it('should load all data', async () => {
    await act(async () => {
      renderTitleUnreceiveContainer();
    });

    expect(mutatorMock.title.GET).toHaveBeenCalled();
    expect(mutatorMock.pieces.GET).toHaveBeenCalled();
    expect(mutatorMock.poLine.GET).toHaveBeenCalled();
    expect(mutatorMock.locations.GET).toHaveBeenCalled();
  });

  it('should redirect to title details when unreceive is cancelled', async () => {
    await act(async () => renderTitleUnreceiveContainer());

    TitleUnreceive.mock.calls[0][0].onCancel();

    expect(historyMock.push).toHaveBeenCalled();
  });

  it('should unreceive pieces', async () => {
    await act(async () => renderTitleUnreceiveContainer(mutator));

    TitleUnreceive.mock.calls[0][0].onSubmit({ receivedItems: [{ id: 'pieceId', isChecked: true }] });

    expect(mutatorMock.unreceive.POST).toHaveBeenCalled();
  });
});
