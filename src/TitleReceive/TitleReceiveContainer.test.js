import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  cleanup,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { useLocationsQuery } from '@folio/stripes-acq-components';

import {
  useReceive,
  useTitleHydratedPieces,
} from '../common/hooks';
import TitleReceiveContainer from './TitleReceiveContainer';
import TitleReceive from './TitleReceive';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
  useLocationsQuery: jest.fn(),
}));
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  stripesConnect: jest.fn(c => c),
}));
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingPane: jest.fn().mockReturnValue('LoadingPane'),
}));
jest.mock('../common/hooks', () => ({
  useReceive: jest.fn().mockReturnValue({}),
  useTitleHydratedPieces: jest.fn(),
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

const renderTitleReceiveContainer = () => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <TitleReceiveContainer
        history={historyMock}
        location={locationMock}
        match={{ params: { id: '001' }, path: 'path', url: 'url' }}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('TitleReceiveContainer', () => {
  beforeEach(() => {
    TitleReceive.mockClear();
    historyMock.push.mockClear();
    useLocationsQuery
      .mockClear()
      .mockReturnValue({ locations: [{ id: 'locationId' }] });
    useTitleHydratedPieces.mockClear().mockReturnValue({
      title: mockTitle,
      pieces: mockPieces,
      orderLine: mockPoLine,
      isLoading: false,
    });
  });

  it('should render loading', async () => {
    useTitleHydratedPieces.mockClear().mockReturnValue({
      title: {},
      pieces: [],
      orderLine: {},
      isLoading: true,
    });
    renderTitleReceiveContainer();

    expect(screen.getByText('LoadingPane')).toBeInTheDocument();
  });

  it('should render component', async () => {
    renderTitleReceiveContainer();

    expect(screen.getByText('TitleReceive')).toBeInTheDocument();
  });

  it('should redirect to title details when receive is cancelled', async () => {
    renderTitleReceiveContainer();

    TitleReceive.mock.calls[0][0].onCancel();

    expect(historyMock.push).toHaveBeenCalled();
  });

  it('should receive pieces', async () => {
    const receiveMock = jest.fn().mockReturnValue(Promise.resolve());

    useReceive.mockClear().mockReturnValue({ receive: receiveMock });

    renderTitleReceiveContainer();

    TitleReceive.mock.calls[0][0].onSubmit({ receivedItems: [{ checked: true, isCreateItem: true }] });

    expect(receiveMock).toHaveBeenCalled();
  });
});
