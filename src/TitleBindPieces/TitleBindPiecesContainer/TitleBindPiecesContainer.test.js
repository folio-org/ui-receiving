import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { useTitleHydratedPieces } from '../../common/hooks';
import TitleBindPieces from '../TitleBindPieces';
import TitleBindPiecesContainer from '.';

jest.mock('@folio/stripes/core', () => ({
  stripesConnect: jest.fn(Component => (props) => (
    <Component {...props} />
  )),
}));

jest.mock('./TitleBindPieces', () => jest.fn().mockReturnValue('TitleBindPieces'));
jest.mock('../../common/hooks', () => ({
  useTitleHydratedPieces: jest.fn(),
}));

const mockTitle = { title: 'Title', id: '001', poLineId: '002' };
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

const renderTitleBindPiecesContainer = () => render(
  <TitleBindPiecesContainer
    history={historyMock}
    location={locationMock}
    match={{ params: { id: '001' }, path: 'path', url: 'url' }}
  />,
  { wrapper: MemoryRouter },
);

describe('TitleBindPiecesContainer', () => {
  beforeEach(() => {
    TitleBindPieces.mockClear();
    historyMock.push.mockClear();
    useTitleHydratedPieces.mockClear().mockReturnValue({ title: mockTitle, isLoading: false });
  });

  it('should display title unreceive', async () => {
    renderTitleBindPiecesContainer();

    expect(screen.getByText('TitleBindPieces')).toBeDefined();
  });

  it('should load all data', async () => {
    renderTitleBindPiecesContainer();

    expect(useTitle).toHaveBeenCalled();
  });

  it('should redirect to title details when TitleBindPieces is cancelled', async () => {
    renderTitleBindPiecesContainer();

    TitleBindPieces.mock.calls[0][0].onCancel();

    expect(historyMock.push).toHaveBeenCalled();
  });
});
