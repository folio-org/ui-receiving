import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { ConfirmRemoveFromPackageModal } from './ConfirmRemoveFromPackageModal';

const displayDeleteHoldingsConfirmation = false;
const open = false;
const onConfirm = jest.fn();
const onCancel = jest.fn();

const defaultProps = {
  displayDeleteHoldingsConfirmation,
  open,
  onConfirm,
  onCancel,
};

describe('Render ConfirmRemoveFromPackageModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the modal', async () => {
    render(<ConfirmRemoveFromPackageModal {...defaultProps} open />);

    expect(screen.getByText('ui-receiving.title.paneTitle.removeFromPackage')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.confirmationModal.removeFromPackage.message')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.confirmationModal.removeFromPackage.confirm')).toBeDefined();
  });

  it('should not render the modal', async () => {
    render(<ConfirmRemoveFromPackageModal {...defaultProps} open={false} />);

    expect(screen.queryByText('ui-receiving.title.paneTitle.removeFromPackage')).toBeNull();
    expect(screen.queryByText('ui-receiving.title.confirmationModal.removeFromPackage.message')).toBeNull();
  });

  it('should call onConfirm on click', async () => {
    render(<ConfirmRemoveFromPackageModal {...defaultProps} open />);

    const button = screen.getByText('ui-receiving.title.confirmationModal.removeFromPackage.confirm');

    await userEvent.click(button);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should display second modal on confirm if displayDeleteHoldingsConfirmation is true', async () => {
    render(<ConfirmRemoveFromPackageModal {...defaultProps} open displayDeleteHoldingsConfirmation />);

    const button = screen.getByText('ui-receiving.title.confirmationModal.removeFromPackage.confirm');

    await userEvent.click(button);

    expect(screen.getByText('ui-receiving.title.confirmationModal.removeHolding.heading')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.confirmationModal.removeHolding.message')).toBeDefined();
  });

  it('should call keepHoldings', async () => {
    render(<ConfirmRemoveFromPackageModal {...defaultProps} open displayDeleteHoldingsConfirmation />);

    const button = screen.getByText('ui-receiving.title.confirmationModal.removeFromPackage.confirm');

    await userEvent.click(button);

    expect(screen.getByText('ui-receiving.title.confirmationModal.removeHolding.heading')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.confirmationModal.removeHolding.message')).toBeDefined();

    const keepHoldings = screen.getByText('ui-receiving.title.confirmationModal.removeHolding.keepHoldings');

    await userEvent.click(keepHoldings);

    expect(onConfirm).toHaveBeenCalledWith({ deleteHoldings: false });
  });

  it('should call deleteHoldings', async () => {
    render(<ConfirmRemoveFromPackageModal {...defaultProps} open displayDeleteHoldingsConfirmation />);

    const button = screen.getByText('ui-receiving.title.confirmationModal.removeFromPackage.confirm');

    await userEvent.click(button);

    expect(screen.getByText('ui-receiving.title.confirmationModal.removeHolding.heading')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.confirmationModal.removeHolding.message')).toBeDefined();

    const deleteHoldings = screen.getByText('ui-receiving.title.confirmationModal.removeHolding.deleteHoldings');

    await userEvent.click(deleteHoldings);

    expect(onConfirm).toHaveBeenCalledWith({ deleteHoldings: true });
  });
});
