import React from 'react';
import { render, screen } from '@testing-library/react';

import { DeletePieceModal } from './DeletePieceModal';

jest.mock('@folio/stripes/components', () => ({
  Modal: jest.fn().mockReturnValue('ModalDeleteWithHolding'),
  ConfirmationModal: jest.fn().mockReturnValue('ConfirmationModal'),
}));

const defaultProps = {
  isLastConnectedItem: false,
  footer: {},
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
};

const renderDeletePieceModal = (props = {}) => render(
  <DeletePieceModal
    {...defaultProps}
    {...props}
  />,
);

describe('DeletePieceModal', () => {
  it('should render confirmation modal to remove a piece', () => {
    renderDeletePieceModal();

    expect(screen.getByText('ConfirmationModal')).toBeInTheDocument();
  });

  it('should render confirmation modal to remove a piece, which related to the last connected item on holding', () => {
    renderDeletePieceModal({ isLastConnectedItem: true });

    expect(screen.getByText('ModalDeleteWithHolding')).toBeInTheDocument();
  });
});
