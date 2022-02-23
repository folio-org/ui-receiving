import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import { RECEIVED_PIECE_VISIBLE_COLUMNS } from '../constants';
import { TitleDetailsReceivedActions } from './TitleDetailsReceivedActions';

const defaultProps = {
  applyFilters: jest.fn(),
  filters: {},
  titleId: 'titleId',
  hasUnreceive: true,
  visibleColumns: RECEIVED_PIECE_VISIBLE_COLUMNS,
  toggleColumn: jest.fn(),
};

const renderTitleDetailsReceivedActions = (props = defaultProps) => (render(
  <TitleDetailsReceivedActions
    {...props}
  />,
  { wrapper: MemoryRouter },
));

describe('TitleDetailsReceivedActions', () => {
  it('should display Title details received actions', () => {
    renderTitleDetailsReceivedActions();

    user.click(screen.getByTestId('received-pieces-action-dropdown'));

    expect(screen.getByText('ui-receiving.title.details.button.unreceive')).toBeDefined();
  });
});

describe('TitleDetailsReceivedActions filters', () => {
  it('should call \'applyFilters\' when filter value was changed', () => {
    renderTitleDetailsReceivedActions({ ...defaultProps, disabled: true });

    user.click(screen.getByText('ui-receiving.filter.supplements'));

    expect(defaultProps.applyFilters).toHaveBeenCalled();
  });
});
