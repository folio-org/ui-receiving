import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { PIECE_STATUS } from './constants';
import { ModalActionButtons } from './ModalActionButtons';

const onSave = jest.fn();
const onDelete = jest.fn();

const defaultProps = {
  disabled: false,
  isCreateAnother: false,
  canDeletePiece: false,
  onDelete,
  onSave,
  status: PIECE_STATUS.expected,
};

const renderComponent = (props = {}) => render(
  <ModalActionButtons {...defaultProps} {...props} />,
);

describe('ModalActionButtons', () => {
  it('should render component', () => {
    renderComponent({ status: 'status' });

    expect(screen.getByText('ui-receiving.piece.actions.saveAndClose')).toBeInTheDocument();
  });

  it('should render `save` button', async () => {
    renderComponent({ isCreateAnother: true });

    expect(screen.getByText('stripes-core.button.save')).toBeInTheDocument();
  });

  it('should call `onSave` function when save button clicked', async () => {
    renderComponent();

    const saveButton = screen.getAllByRole('button')[0];

    await user.click(saveButton);

    expect(onSave).toHaveBeenCalled();
  });
});
