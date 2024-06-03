import { MemoryRouter } from 'react-router-dom';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  usePOLine,
  useTitle,
} from '../common/hooks';
import { useUnboundPieces } from './hooks';
import TitleBindPieces from './TitleBindPieces';
import TitleBindPiecesContainer from './TitleBindPiecesContainer';

jest.mock('./TitleBindPieces', () => jest.fn().mockReturnValue('TitleBindPieces'));

jest.mock('../common/hooks', () => ({
  usePOLine: jest.fn(),
  useTitle: jest.fn(),
}));
jest.mock('./hooks', () => ({
  useUnboundPieces: jest.fn(),
}));

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

const renderTitleBindPiecesContainer = () => (render(
  <TitleBindPiecesContainer
    history={historyMock}
    location={locationMock}
    match={{ params: { id: '001' }, path: 'path', url: 'url' }}
  />,
  { wrapper: MemoryRouter },
));

describe('TitleBindPiecesContainer', () => {
  let mutator;

  beforeEach(() => {
    TitleBindPieces.mockClear();
    historyMock.push.mockClear();
    usePOLine.mockClear().mockReturnValue({ poLine: mockPoLine, isLoading: false });
    useTitle.mockClear().mockReturnValue({ title: mockTitle, isLoading: false });
    useUnboundPieces.mockClear().mockReturnValue({ unboundPieces: mockPieces, isLoading: false });
  });

  it('should display title unreceive', async () => {
    await act(async () => {
      renderTitleBindPiecesContainer();
    });

    expect(screen.getByText('TitleBindPieces')).toBeDefined();
  });

  it('should load all data', async () => {
    await act(async () => {
      renderTitleBindPiecesContainer();
    });

    expect(usePOLine).toHaveBeenCalled();
    expect(useTitle).toHaveBeenCalled();
    expect(useUnboundPieces).toHaveBeenCalled();
  });

  it('should redirect to title details when TitleBindPieces is cancelled', async () => {
    await act(async () => renderTitleBindPiecesContainer());

    TitleBindPieces.mock.calls[0][0].onCancel();

    expect(historyMock.push).toHaveBeenCalled();
  });
});
