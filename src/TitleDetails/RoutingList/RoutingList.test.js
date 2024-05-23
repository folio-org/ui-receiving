import { MemoryRouter } from 'react-router-dom';
import { render } from '@folio/jest-config-stripes/testing-library/react';

import {
  ROUTING_LIST_CREATE_ROUTE,
  ROUTING_LIST_VIEW_ROUTE,
  ROUTING_LIST_EDIT_ROUTE,
} from './constants';
import { RoutingList } from './RoutingList';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  RoutingListCreate: () => <div>RoutingListCreate</div>,
  RoutingListView: () => <div>RoutingListView</div>,
  RoutingListEdit: () => <div>RoutingListEdit</div>,
}));

describe('RoutingList', () => {
  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);

    return render(
      <MemoryRouter initialEntries={[route]}>
        {ui}
      </MemoryRouter>,
    );
  };

  it('should render RoutingListCreate for the create route', () => {
    const { getByText } = renderWithRouter(<RoutingList />, { route: ROUTING_LIST_CREATE_ROUTE });

    expect(getByText('RoutingListCreate')).toBeInTheDocument();
  });

  it('should render RoutingListView for the view route', () => {
    const { getByText } = renderWithRouter(<RoutingList />, { route: ROUTING_LIST_VIEW_ROUTE });

    expect(getByText('RoutingListView')).toBeInTheDocument();
  });

  it('should render RoutingListEdit for the edit route', () => {
    const { getByText } = renderWithRouter(<RoutingList />, { route: ROUTING_LIST_EDIT_ROUTE });

    expect(getByText('RoutingListEdit')).toBeInTheDocument();
  });
});
