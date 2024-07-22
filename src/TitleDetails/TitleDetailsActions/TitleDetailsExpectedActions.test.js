import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { EXPECTED_PIECE_VISIBLE_COLUMNS } from '../../Piece';
import { TitleDetailsExpectedActions } from './TitleDetailsExpectedActions';

const defaultProps = {
  applyFilters: jest.fn(),
  checkinItems: true,
  filters: {},
  onPieceCreate: jest.fn(),
  openReceiveList: jest.fn(),
  hasReceive: true,
  visibleColumns: EXPECTED_PIECE_VISIBLE_COLUMNS,
  toggleColumn: jest.fn(),
};

const renderTitleDetailsExpectedActions = (props = {}) => (render(
  <TitleDetailsExpectedActions
    {...defaultProps}
    {...props}
  />,
));

describe('TitleDetailsExpectedActions', () => {
  it('should display Title details expected actions', async () => {
    renderTitleDetailsExpectedActions();

    await user.click(screen.getByTestId('expected-pieces-action-dropdown'));

    expect(screen.getByTestId('receive-button')).toBeDefined();
    expect(screen.getByTestId('add-piece-button')).toBeDefined();
  });

  it('should call openReceiveList when receive button is pressed and actions are not disabled', async () => {
    defaultProps.openReceiveList.mockClear();
    renderTitleDetailsExpectedActions();

    await user.click(screen.getByTestId('expected-pieces-action-dropdown'));
    await user.click(screen.getByTestId('receive-button'));

    expect(defaultProps.openReceiveList).toHaveBeenCalled();
  });

  it('should call onPieceCreate when add piece button is pressed and actions are not disabled', async () => {
    defaultProps.onPieceCreate.mockClear();
    renderTitleDetailsExpectedActions({ canAddPiece: true });

    await user.click(screen.getByTestId('expected-pieces-action-dropdown'));
    await user.click(screen.getByTestId('add-piece-button'));

    expect(defaultProps.onPieceCreate).toHaveBeenCalled();
  });

  it('should not call openReceiveList when receive button is pressed and actions are disabled', async () => {
    defaultProps.openReceiveList.mockClear();
    renderTitleDetailsExpectedActions({ ...defaultProps, disabled: true });

    await user.click(screen.getByTestId('expected-pieces-action-dropdown'));
    await user.click(screen.getByTestId('receive-button'));

    expect(defaultProps.openReceiveList).not.toHaveBeenCalled();
  });

  it('should not call onPieceCreate when add piece button is pressed and actions are disabled', async () => {
    defaultProps.onPieceCreate.mockClear();
    renderTitleDetailsExpectedActions({ ...defaultProps, disabled: true });

    await user.click(screen.getByTestId('expected-pieces-action-dropdown'));
    await user.click(screen.getByTestId('add-piece-button'));

    expect(defaultProps.onPieceCreate).not.toHaveBeenCalled();
  });
});

describe('TitleDetailsExpectedActions filters', () => {
  it('should call \'applyFilters\' when filter value was changed', async () => {
    renderTitleDetailsExpectedActions({ ...defaultProps, disabled: true });

    await user.click(screen.getByText('ui-receiving.filter.supplements'));

    expect(defaultProps.applyFilters).toHaveBeenCalled();
  });
});
