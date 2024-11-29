import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { useTitleHydratedPieces } from '../common/hooks';
import TitleUnreceive from './TitleUnreceive';
import TitleUnreceiveContainer from './TitleUnreceiveContainer';

jest.mock('../common/hooks', () => ({
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

  it('should display title unreceive', () => {
    renderTitleUnreceiveContainer();

    expect(screen.getByText('TitleUnreceive')).toBeDefined();
  });

  it('should call `useTitleHydratedPieces`', () => {
    renderTitleUnreceiveContainer();

    expect(useTitleHydratedPieces).toHaveBeenCalled();
  });

  it('should redirect to title details when unreceive is cancelled', () => {
    renderTitleUnreceiveContainer();

    TitleUnreceive.mock.calls[0][0].onCancel();

    expect(historyMock.push).toHaveBeenCalled();
  });

  it('should unreceive pieces', () => {
    renderTitleUnreceiveContainer(mutator);

    TitleUnreceive.mock.calls[0][0].onSubmit({ receivedItems: [{ id: 'pieceId', isChecked: true }] });

    expect(mutatorMock.unreceive.POST).toHaveBeenCalled();
  });
});
