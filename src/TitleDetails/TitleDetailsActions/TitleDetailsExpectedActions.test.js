import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { TitleDetailsExpectedActions } from './TitleDetailsExpectedActions';

const defaultProps = {
  checkinItems: true,
  openAddPieceModal: jest.fn(),
  openReceiveList: jest.fn(),
  hasReceive: true,
};

const renderTitleDetailsExpectedActions = (props = defaultProps) => (render(
  <TitleDetailsExpectedActions
    {...props}
  />,
));

describe('TitleDetailsExpectedActions', () => {
  it('should display Title details expected actions', () => {
    renderTitleDetailsExpectedActions();

    expect(screen.getByText('ui-receiving.title.details.button.receive')).toBeDefined();
    expect(screen.getByText('ui-receiving.piece.button.addPiece')).toBeDefined();
  });

  it('should call openReceiveList when receive button is pressed and actions are not disabled', () => {
    defaultProps.openReceiveList.mockClear();
    renderTitleDetailsExpectedActions();

    user.click(screen.getByText('ui-receiving.title.details.button.receive'));

    expect(defaultProps.openReceiveList).toHaveBeenCalled();
  });

  it('should call openAddPieceModal when add piece button is pressed and actions are not disabled', () => {
    defaultProps.openAddPieceModal.mockClear();
    renderTitleDetailsExpectedActions();

    user.click(screen.getByText('ui-receiving.piece.button.addPiece'));

    expect(defaultProps.openAddPieceModal).toHaveBeenCalled();
  });

  it('should not call openReceiveList when receive button is pressed and actions are disabled', () => {
    defaultProps.openReceiveList.mockClear();
    renderTitleDetailsExpectedActions({ ...defaultProps, disabled: true });

    user.click(screen.getByText('ui-receiving.title.details.button.receive'));

    expect(defaultProps.openReceiveList).not.toHaveBeenCalled();
  });

  it('should not call openAddPieceModal when add piece button is pressed and actions are disabled', () => {
    defaultProps.openAddPieceModal.mockClear();
    renderTitleDetailsExpectedActions({ ...defaultProps, disabled: true });

    user.click(screen.getByText('ui-receiving.piece.button.addPiece'));

    expect(defaultProps.openAddPieceModal).not.toHaveBeenCalled();
  });
});
