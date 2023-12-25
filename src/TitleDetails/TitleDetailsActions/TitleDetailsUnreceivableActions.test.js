import { MemoryRouter } from 'react-router';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { UNRECEIVABLE_PIECE_VISIBLE_COLUMNS } from '../constants';
import { TitleDetailsUnreceivableActions } from './TitleDetailsUnreceivableActions';

const defaultProps = {
  applyFilters: jest.fn(),
  filters: {},
  titleId: 'titleId',
  hasRecords: true,
  visibleColumns: UNRECEIVABLE_PIECE_VISIBLE_COLUMNS,
  toggleColumn: jest.fn(),
};

const renderTitleDetailsUnreceivableActions = (props = {}) => render(
  <TitleDetailsUnreceivableActions
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('TitleDetailsUnreceivableActions', () => {
  it('should display unreceivable accordion actions', async () => {
    renderTitleDetailsUnreceivableActions();

    await user.click(screen.getByTestId('unreceivable-pieces-action-dropdown'));

    expect(screen.getByText('ui-receiving.title.details.button.expect')).toBeInTheDocument();
  });
});

describe('TitleDetailsUnreceivableActions filters', () => {
  it('should call \'applyFilters\' when filter value changed', async () => {
    renderTitleDetailsUnreceivableActions({ disabled: true });

    await user.click(screen.getByText('ui-receiving.filter.supplements'));

    expect(defaultProps.applyFilters).toHaveBeenCalled();
  });
});
