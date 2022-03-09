import React from 'react';
import { act, render, screen } from '@testing-library/react';

import ReceivingListFilter from './ReceivingListFilter';

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const renderReceivingListFilter = (props = defaultProps) => (render(
  <ReceivingListFilter
    {...props}
  />,
));

describe('ReceivingListFilter', () => {
  it('should display receiving filters', async () => {
    await act(async () => renderReceivingListFilter());

    expect(screen.getByText('ui-receiving.filter.orderStatus')).toBeDefined();
    expect(screen.getByText('ui-receiving.filter.vendor')).toBeDefined();
    expect(screen.getByText('ui-receiving.filter.orderType')).toBeDefined();
    expect(screen.getByText('ui-receiving.filter.materialType')).toBeDefined();
    expect(screen.getByText('ui-receiving.filter.orderFormat')).toBeDefined();
    expect(screen.getByText('ui-receiving.filter.location')).toBeDefined();
    expect(screen.getByText('ui-orders.filter.rush')).toBeDefined();
  });
});
