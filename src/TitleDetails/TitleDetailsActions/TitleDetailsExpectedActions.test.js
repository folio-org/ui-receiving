import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { EXPECTED_PIECE_VISIBLE_COLUMNS } from '../constants';
import { TitleDetailsExpectedActions } from './TitleDetailsExpectedActions';

const defaultProps = {
  checkinItems: true,
  openAddPieceModal: jest.fn(),
  openReceiveList: jest.fn(),
  hasReceive: true,
  visibleColumns: EXPECTED_PIECE_VISIBLE_COLUMNS,
  toggleColumn: jest.fn(),
};

const renderTitleDetailsExpectedActions = (props = defaultProps) => (render(
  <TitleDetailsExpectedActions
    {...props}
  />,
));

describe('TitleDetailsExpectedActions', () => {
  it('should display Title details expected actions', () => {
    renderTitleDetailsExpectedActions();

    user.click(screen.getByTestId('expected-pieces-action-dropdown'));

    expect(screen.getByTestId('receive-button')).toBeDefined();
    expect(screen.getByTestId('add-piece-button')).toBeDefined();
  });

  it('should call openReceiveList when receive button is pressed and actions are not disabled', () => {
    defaultProps.openReceiveList.mockClear();
    renderTitleDetailsExpectedActions();

    user.click(screen.getByTestId('expected-pieces-action-dropdown'));
    user.click(screen.getByTestId('receive-button'));

    expect(defaultProps.openReceiveList).toHaveBeenCalled();
  });

  it('should call openAddPieceModal when add piece button is pressed and actions are not disabled', () => {
    defaultProps.openAddPieceModal.mockClear();
    renderTitleDetailsExpectedActions();

    user.click(screen.getByTestId('expected-pieces-action-dropdown'));
    user.click(screen.getByTestId('add-piece-button'));

    expect(defaultProps.openAddPieceModal).toHaveBeenCalled();
  });

  it('should not call openReceiveList when receive button is pressed and actions are disabled', () => {
    defaultProps.openReceiveList.mockClear();
    renderTitleDetailsExpectedActions({ ...defaultProps, disabled: true });

    user.click(screen.getByTestId('expected-pieces-action-dropdown'));
    user.click(screen.getByTestId('receive-button'));

    expect(defaultProps.openReceiveList).not.toHaveBeenCalled();
  });

  it('should not call openAddPieceModal when add piece button is pressed and actions are disabled', () => {
    defaultProps.openAddPieceModal.mockClear();
    renderTitleDetailsExpectedActions({ ...defaultProps, disabled: true });

    user.click(screen.getByTestId('expected-pieces-action-dropdown'));
    user.click(screen.getByTestId('add-piece-button'));

    expect(defaultProps.openAddPieceModal).not.toHaveBeenCalled();
  });
});
