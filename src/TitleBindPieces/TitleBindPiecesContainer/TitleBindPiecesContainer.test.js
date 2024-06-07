import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { useTitleHydratedPieces } from '../../common/hooks';
import TitleBindPieces from '../TitleBindPieces';
import TitleBindPiecesContainer from './TitleBindPiecesContainer';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  stripesConnect: jest.fn(Component => (props) => (
    <Component {...props} />
  )),
}));
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingPane: jest.fn().mockReturnValue('Loading'),
}));

jest.mock('../TitleBindPieces', () => jest.fn().mockReturnValue('TitleBindPieces'));
jest.mock('../TitleBindPiecesConfirmationModal', () => ({
  TitleBindPiecesConfirmationModal: jest.fn().mockReturnValue('TitleBindPiecesConfirmationModal'),
}));
jest.mock('../hooks', () => ({
  useBindPiecesMutation: jest.fn().mockReturnValue({ bindPieces: jest.fn(), isBinding: false }),
}));
jest.mock('../../common/hooks', () => ({
  useTitleHydratedPieces: jest.fn(),
}));

const mockTitle = { title: 'Title', id: '001', poLineId: '002' };
const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  push: jest.fn(),
  go: jest.fn(),
  location: locationMock,
};

const renderTitleBindPiecesContainer = () => render(
  <TitleBindPiecesContainer
    history={historyMock}
    location={locationMock}
    match={{ params: { id: '001' }, path: 'path', url: 'url' }}
    stripes={{
      clone: jest.fn(),
      user: {
        user: {
          id: '001',
        },
      },
    }}
  />,
  { wrapper: MemoryRouter },
);

describe('TitleBindPiecesContainer', () => {
  beforeEach(() => {
    TitleBindPieces.mockClear();
    historyMock.push.mockClear();
    useTitleHydratedPieces
      .mockClear()
      .mockReturnValue({
        isLoading: false,
        title: mockTitle,
      });
  });

  it('should display title TitleBindPieces', async () => {
    renderTitleBindPiecesContainer();

    expect(screen.getByText(/TitleBindPieces/)).toBeInTheDocument();
  });

  it('should display loading when `useTitleHydratedPieces` isLoading = `true`', async () => {
    useTitleHydratedPieces
      .mockClear()
      .mockReturnValue({
        isLoading: true,
      });
    renderTitleBindPiecesContainer();

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should redirect to title details when TitleBindPieces is cancelled', async () => {
    renderTitleBindPiecesContainer();

    TitleBindPieces.mock.calls[0][0].onCancel();

    expect(historyMock.push).toHaveBeenCalled();
  });
});
