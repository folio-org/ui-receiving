import React from 'react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { DeleteHoldingsModal } from './DeleteHoldingsModal';

const defaultProps = {
  onCancel: jest.fn(),
  onKeepHoldings: jest.fn(),
  onConfirm: jest.fn(),
};

const renderDeleteHoldingsModal = (props = {}) => render(
  <DeleteHoldingsModal
    {...defaultProps}
    {...props}
  />,
);

describe('DeleteHoldingsModal', () => {
  it('should render delete holdings modal', () => {
    renderDeleteHoldingsModal();

    expect(screen.getByText('ui-receiving.piece.actions.edit.deleteHoldings.message')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.actions.edit.keepHoldings')).toBeInTheDocument();
    expect(screen.getAllByText('ui-receiving.piece.actions.delete.deleteHoldings')).toBeDefined();
  });

  it('should call onCancel when cancel was clicked', async () => {
    renderDeleteHoldingsModal();

    const cancelBtn = await screen.findByText('ui-receiving.piece.actions.cancel');

    await user.click(cancelBtn);
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should call onKeepHoldings when \'Keep holdings\' btn was clicked', async () => {
    renderDeleteHoldingsModal();

    const keepHoldingsBrn = await screen.findByText('ui-receiving.piece.actions.edit.keepHoldings');

    await user.click(keepHoldingsBrn);
    expect(defaultProps.onKeepHoldings).toHaveBeenCalled();
  });

  it('should call onConfirm when \'Delete holdings\' btn was clicked', async () => {
    renderDeleteHoldingsModal();

    const deleteBtn = await screen.findByRole('button', {
      name: 'ui-receiving.piece.actions.delete.deleteHoldings',
    });

    await user.click(deleteBtn);
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });
});
