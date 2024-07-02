import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  render,
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import { useLocationsQuery } from '@folio/stripes-acq-components';

import { FILTERS } from '../constants';
import ReceivingListFilter from './ReceivingListFilter';

jest.mock('@folio/stripes-acq-components/lib/hooks', () => ({
  ...jest.requireActual('@folio/stripes-acq-components/lib/hooks'),
  useLocationsQuery: jest.fn(),
}));

const locations = [
  { id: 'location-1', name: 'Test non-ECS location 1' },
  { id: 'location-2', name: 'Test non-ECS location 2' },
  { id: 'location-3', name: 'Test non-ECS location 3' },
];

const locationsECS = [
  {
    id: 'ecs-location-1',
    name: 'Test ECS location 1',
    tenantId: 'test-tenant',
  },
  {
    id: 'ecs-location-2',
    name: 'Test ECS location 2',
    tenantId: 'test-tenant',
  },
];

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderReceivingListFilter = (props = {}) => (render(
  <ReceivingListFilter
    {...defaultProps}
    {...props}
  />,
  { wrapper },
));

describe('ReceivingListFilter', () => {
  beforeEach(() => {
    useLocationsQuery
      .mockClear()
      .mockReturnValue({ locations });
  });

  it('should display receiving filters', async () => {
    renderReceivingListFilter();

    expect(screen.getByText('ui-receiving.filter.orderStatus')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.filter.vendor')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.filter.orderType')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.filter.materialType')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.filter.orderFormat')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.filter.location')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.filter.rush')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.filter.isBinderyActive')).toBeInTheDocument();
  });

  describe('ECS mode', () => {
    beforeEach(() => {
      useLocationsQuery
        .mockClear()
        .mockReturnValue({ locations: locationsECS });
    });

    it('should render locations filter with selected options', () => {
      const { container } = renderReceivingListFilter({
        crossTenant: true,
        activeFilters: { [FILTERS.LOCATION]: locationsECS.map(({ id }) => id) },
      });

      locationsECS.forEach(({ name }) => {
        expect(within(container.querySelector('.multiSelectValueListContainer')).getByText(name)).toBeInTheDocument();
      });
    });
  });
});
