import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { useTitleHydratedPieces } from '../../common/hooks';
import { TRANSFER_REQUEST_ACTIONS } from '../constants';
import { useBindPiecesMutation } from '../hooks';
import TitleBindPieces from '../TitleBindPieces';
import { TitleBindPiecesContainer } from './TitleBindPiecesContainer';

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
  action: 'PUSH',
  go: jest.fn(),
  location: locationMock,
};

const renderTitleBindPiecesContainer = () => render(
  <TitleBindPiecesContainer />,
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
        orderLine: { id: '002' },
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

  it('should call `bindPieces` mutation on submit', async () => {
    const mockBindPieces = jest.fn().mockResolvedValue(() => Promise.resolve());

    useBindPiecesMutation
      .mockClear()
      .mockReturnValue({
        bindPieces: mockBindPieces,
        isBinding: false,
      });
    renderTitleBindPiecesContainer();

    TitleBindPieces.mock.calls[0][0].onSubmit({
      'receivedItems': [
        {
          'id': '9b946a34-f762-4672-b9bc-adf71390796a',
          'holdingId': 'ae483aad-ee4c-4545-98f7-c2538c10b1cc',
          'checked': true,
        },
        {
          'id': '20c6305a-80c6-42e4-8488-f1ea8dea1d40',
          'holdingId': 'ae483aad-ee4c-4545-98f7-c2538c10b1cc',
          'checked': true,
        },
      ],
      'bindItem': {
        'materialTypeId': '1a54b431-2e4f-452d-9cae-9cee66c9a892',
        'permanentLoanTypeId': '2b94c631-fca9-4892-a730-03ee529ffe27',
        'locationId': 'fcd64ce1-6995-48f0-840e-89ffa2288371',
      },
    });

    expect(mockBindPieces).toHaveBeenCalledWith({
      poLineId: '002',
      bindPieceIds: [
        '9b946a34-f762-4672-b9bc-adf71390796a',
        '20c6305a-80c6-42e4-8488-f1ea8dea1d40',
      ],
      bindItem: {
        materialTypeId: '1a54b431-2e4f-452d-9cae-9cee66c9a892',
        permanentLoanTypeId: '2b94c631-fca9-4892-a730-03ee529ffe27',
        locationId: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
      },
    });
  });

  it('should call `bindPieces` mutation with transfer confirmation action on submit', async () => {
    const mockBindPieces = jest.fn().mockResolvedValue(() => Promise.resolve());

    useBindPiecesMutation
      .mockClear()
      .mockReturnValue({
        bindPieces: mockBindPieces,
        isBinding: false,
      });
    renderTitleBindPiecesContainer();

    TitleBindPieces.mock.calls[0][0].onSubmit({
      'receivedItems': [
        {
          'id': '9b946a34-f762-4672-b9bc-adf71390796a',
          'holdingId': 'ae483aad-ee4c-4545-98f7-c2538c10b1cc',
          'checked': true,
          itemId: '123',
          request: { requesterId: '001' },
        },
      ],
      'bindItem': {
        'materialTypeId': '1a54b431-2e4f-452d-9cae-9cee66c9a892',
        'permanentLoanTypeId': '2b94c631-fca9-4892-a730-03ee529ffe27',
        'locationId': 'fcd64ce1-6995-48f0-840e-89ffa2288371',
      },
    });

    const transferButton = await screen.findByText('ui-receiving.bind.pieces.modal.button.transfer');

    expect(transferButton).toBeInTheDocument();

    transferButton.click();

    expect(mockBindPieces).toHaveBeenCalledWith({
      poLineId: '002',
      bindPieceIds: [
        '9b946a34-f762-4672-b9bc-adf71390796a',
      ],
      bindItem: {
        materialTypeId: '1a54b431-2e4f-452d-9cae-9cee66c9a892',
        permanentLoanTypeId: '2b94c631-fca9-4892-a730-03ee529ffe27',
        locationId: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
      },
      requestsAction: TRANSFER_REQUEST_ACTIONS.transfer,
    });
  });
});
