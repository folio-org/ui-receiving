import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { PIECE_STATUS } from '@folio/stripes-acq-components';

import { PieceFormActionButtons } from './PieceFormActionButtons';

const onSave = jest.fn();
const onDelete = jest.fn();

const defaultProps = {
  disabled: false,
  isEditMode: false,
  isCreateAnother: false,
  onClaimDelay: jest.fn(),
  onClaimSend: jest.fn(),
  onCreateAnotherPiece: jest.fn(),
  onDelete,
  onReceive: jest.fn(),
  onSave,
  onStatusChange: jest.fn(),
  onUnreceivePiece: jest.fn(),
  status: PIECE_STATUS.expected,
};

const renderComponent = (props = {}) => render(
  <PieceFormActionButtons {...defaultProps} {...props} />,
);

describe('PieceFormActionButtons', () => {
  it('should render component', () => {
    renderComponent({ status: 'status' });

    expect(screen.getByText('stripes-components.saveAndClose')).toBeInTheDocument();
  });

  it('should call `onSave` function when save button clicked', async () => {
    renderComponent();

    const saveButton = screen.getAllByRole('button')[0];

    await user.click(saveButton);

    expect(onSave).toHaveBeenCalled();
  });

  describe('Actions menu availability', () => {
    const actionsDisabled = {
      saveAndClose: true,
      delete: true,
    };

    it('should disable the menu in edit mode when save and delete are disabled', () => {
      renderComponent({ actionsDisabled, isEditMode: true });

      expect(screen.getByTestId('dropdown-trigger-button')).toBeDisabled();
    });

    it('should disable the menu in create mode when save is disabled', () => {
      renderComponent({ actionsDisabled, isEditMode: false });

      expect(screen.getByTestId('dropdown-trigger-button')).toBeDisabled();
    });

    it('should disable the menu while submitting', () => {
      renderComponent({ isEditMode: true, submitting: true });

      expect(screen.getByTestId('dropdown-trigger-button')).toBeDisabled();
    });
  });
});
