import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { useInstanceHoldingsQuery } from '@folio/stripes-acq-components';

import LineLocationsView from './LineLocationsView';

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useInstanceHoldingsQuery: jest.fn(),
  };
});

const defaultProps = {
  poLine: { locations: [{ holdingId: 'holdingId' }] },
  locations: [{ id: '001', name: 'Annex', code: 'AN' }],
};

const renderLineLocationsView = (props = defaultProps) => (render(
  <LineLocationsView
    {...props}
  />,
));

describe('LineLocationsView', () => {
  beforeEach(() => {
    useInstanceHoldingsQuery
      .mockClear()
      .mockReturnValue({
        isLoading: false,
        holdings: [{ id: 'holdingId', permanentLocationId: '001' }],
      });
  });

  it('should display holding locations', () => {
    renderLineLocationsView();

    expect(screen.getByText('ui-receiving.piece.lineLocations')).toBeDefined();
    expect(screen.getByText(defaultProps.locations[0].name)).toBeDefined();
  });

  it('should display line locations', () => {
    renderLineLocationsView({ ...defaultProps, poLine: { locations: [{ locationId: '001' }] } });

    expect(screen.getByText('ui-receiving.piece.lineLocations')).toBeDefined();
    expect(screen.getByText(`${defaultProps.locations[0].name} (${defaultProps.locations[0].code})`)).toBeDefined();
  });
});
