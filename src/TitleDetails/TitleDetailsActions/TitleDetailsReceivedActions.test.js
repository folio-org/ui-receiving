import { MemoryRouter } from 'react-router';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import {
  MENU_FILTERS,
  RECEIVED_PIECE_VISIBLE_COLUMNS,
} from '../constants';
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
  it('should display Title details received actions', async () => {
    renderTitleDetailsReceivedActions();

    await user.click(screen.getByTestId('received-pieces-action-dropdown'));

    expect(screen.getByText('ui-receiving.title.details.button.unreceive')).toBeDefined();
  });
});

describe('TitleDetailsReceivedActions filters', () => {
  it('should call \'applyFilters\' when filter value was changed', async () => {
    renderTitleDetailsReceivedActions({ ...defaultProps, disabled: true });

    await user.click(screen.getByText('ui-receiving.filter.supplements'));
    expect(defaultProps.applyFilters).toHaveBeenCalledWith(MENU_FILTERS.supplement, ['true']);

    await user.click(screen.getByText('ui-receiving.filter.bound'));
    expect(defaultProps.applyFilters).toHaveBeenCalledWith(MENU_FILTERS.bound, ['true']);
  });
});
