import React from 'react';
import { render, screen } from '@testing-library/react';

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
});
