import {
  render,
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import { checkIfUserInCentralTenant } from '@folio/stripes/core';
import {
  ConsortiumLocationsContext,
  ConsortiumLocationsContextProvider,
  LocationsContext,
  LocationsContextProvider,
} from '@folio/stripes-acq-components';

import { FILTERS } from '../constants';
import ReceivingListFilter from './ReceivingListFilter';

jest.mock('@folio/stripes-acq-components/lib/consortia/contexts', () => ({
  ...jest.requireActual('@folio/stripes-acq-components/lib/consortia/contexts'),
  ConsortiumLocationsContextProvider: jest.fn(),
}));

jest.mock('@folio/stripes-acq-components/lib/contexts', () => ({
  ...jest.requireActual('@folio/stripes-acq-components/lib/contexts'),
  LocationsContextProvider: jest.fn(),
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

const buildContextProviderMock = (Context, value) => ({ children }) => {
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  centralOrdering: false,
  disabled: false,
};

const renderReceivingListFilter = (props = {}) => (render(
  <ReceivingListFilter
    {...defaultProps}
    {...props}
  />,
));

describe('ReceivingListFilter', () => {
  beforeEach(() => {
    checkIfUserInCentralTenant
      .mockClear()
      .mockReturnValue(false);
    LocationsContextProvider
      .mockClear()
      .mockImplementation(buildContextProviderMock(LocationsContext, { locations }));
  });

  it('should display receiving filters', async () => {
    renderReceivingListFilter();

    expect(screen.getByText('ui-receiving.filter.orderStatus')).toBeDefined();
    expect(screen.getByText('ui-receiving.filter.vendor')).toBeDefined();
    expect(screen.getByText('ui-receiving.filter.orderType')).toBeDefined();
    expect(screen.getByText('ui-receiving.filter.materialType')).toBeDefined();
    expect(screen.getByText('ui-receiving.filter.orderFormat')).toBeDefined();
    expect(screen.getByText('ui-receiving.filter.location')).toBeDefined();
    expect(screen.getByText('ui-receiving.filter.rush')).toBeDefined();
  });

  describe('ECS mode', () => {
    beforeEach(() => {
      checkIfUserInCentralTenant
        .mockClear()
        .mockReturnValue(true);
      ConsortiumLocationsContextProvider
        .mockClear()
        .mockImplementation(buildContextProviderMock(ConsortiumLocationsContext, { locations: locationsECS }));
    });

    it('should render locations filter with selected options', () => {
      const { container } = renderReceivingListFilter({
        centralOrdering: true,
        activeFilters: { [FILTERS.LOCATION]: locationsECS.map(({ id }) => id) },
      });

      locationsECS.forEach(({ name }) => {
        expect(within(container.querySelector('.multiSelectValueListContainer')).getByText(name)).toBeInTheDocument();
      });
    });
  });
});
