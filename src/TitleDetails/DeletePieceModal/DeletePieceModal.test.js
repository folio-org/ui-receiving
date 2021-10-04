import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { DeletePieceModal } from './DeletePieceModal';

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
  <DeletePieceModal
    {...defaultProps}
    {...props}
  />,
);

describe('DeletePieceModal', () => {
  it('should render default delete piece modal', () => {
    renderDeletePieceModal();

    expect(screen.getByText('ui-receiving.piece.actions.cancel')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.delete.heading')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.actions.delete.deleteItem')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.actions.delete.deleteHoldingsAndItem')).toBeInTheDocument();
  });

  it('should render delete piece (with holding) modal', () => {
    renderDeletePieceModal({
      piece: {
        holdingsRecordId: null,
      },
    });

    expect(screen.getByText('ui-receiving.piece.actions.cancel')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.delete.heading')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.delete.confirm')).toBeInTheDocument();
  });

  it('should call onCancel when cancel was clicked', async () => {
    renderDeletePieceModal();

    const cancelBtn = await screen.findByText('ui-receiving.piece.actions.cancel');

    user.click(cancelBtn);
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should call onConfirm when delete btn was clicked', async () => {
    renderDeletePieceModal();

    const deleteBtn = await screen.findByText('ui-receiving.piece.actions.delete.deleteHoldingsAndItem');

    user.click(deleteBtn);
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });
});
