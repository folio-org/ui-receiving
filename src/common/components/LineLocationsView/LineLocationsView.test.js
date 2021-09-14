import React from 'react';
import { render, screen } from '@testing-library/react';

import LineLocationsView from './LineLocationsView';

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useLineHoldings: jest.fn().mockReturnValue({
      isLoading: false,
      holdings: [{ id: 'holdingId', permanentLocationId: '001' }],
    }),
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
