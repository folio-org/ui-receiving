import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import DeletePieceModalContainer from './DeletePieceModalContainer';

jest.mock('../hooks', () => ({
  useHoldingItems: () => ({ itemsCount: 1, isFetching: false }),
}));

const defaultProps = {
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
  piece: {
    itemId: 'itemId',
    holdingsRecordId: 'holdingsRecordId',
  },
  setIsLoading: jest.fn(),
};

const renderDeletePieceModal = (props = {}) => render(
  <DeletePieceModalContainer
    {...defaultProps}
    {...props}
  />,
);

describe('DeletePieceModalContainer', () => {
  it('should render delete piece modal', () => {
    renderDeletePieceModal();

    expect(screen.getByText('ui-receiving.piece.delete.heading')).toBeInTheDocument();
  });

  it('should call onConfirm when delete btn was clicked', async () => {
    renderDeletePieceModal();

    const deleteBtn = await screen.findByText('ui-receiving.piece.actions.delete.deleteHoldingsAndItem');

    user.click(deleteBtn);
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });
});
