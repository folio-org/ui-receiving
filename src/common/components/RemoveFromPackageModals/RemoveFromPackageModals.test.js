import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { RemoveFromPackageModals } from './RemoveFromPackageModals';

const isRemoveFromPackageOpen = false;
const isRemoveHoldingsOpen = false;
const onConfirmRemoveFromPackage = jest.fn();
const toggleRemoveFromPackageModal = jest.fn();
const toggleRemoveHoldingsModal = jest.fn();

const defaultProps = {
  isRemoveFromPackageOpen,
  isRemoveHoldingsOpen,
  onConfirmRemoveFromPackage,
  toggleRemoveFromPackageModal,
  toggleRemoveHoldingsModal,
};

describe('Render RemoveFromPackageModals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the modal', async () => {
    render(<RemoveFromPackageModals {...defaultProps} isRemoveFromPackageOpen />);

    expect(screen.getByText('ui-receiving.title.paneTitle.removeFromPackage')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.confirmationModal.removeFromPackage.message')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.confirmationModal.removeFromPackage.confirm')).toBeDefined();
  });

  it('should not render the modal', async () => {
    render(<RemoveFromPackageModals {...defaultProps} isRemoveFromPackageOpen={false} />);

    expect(screen.queryByText('ui-receiving.title.paneTitle.removeFromPackage')).toBeNull();
    expect(screen.queryByText('ui-receiving.title.confirmationModal.removeFromPackage.message')).toBeNull();
  });

  it('should call onConfirm on click', async () => {
    render(<RemoveFromPackageModals {...defaultProps} isRemoveFromPackageOpen />);

    const button = screen.getByText('ui-receiving.title.confirmationModal.removeFromPackage.confirm');

    await userEvent.click(button);

    expect(onConfirmRemoveFromPackage).toHaveBeenCalledTimes(1);
  });

  it('should display second modal on confirm if displayDeleteHoldingsConfirmation is true', async () => {
    render(<RemoveFromPackageModals {...defaultProps} isRemoveFromPackageOpen isRemoveHoldingsOpen />);

    const button = screen.getByText('ui-receiving.title.confirmationModal.removeFromPackage.confirm');

    await userEvent.click(button);

    expect(screen.getByText('ui-receiving.title.confirmationModal.removeHolding.heading')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.confirmationModal.removeHolding.message')).toBeDefined();
  });

  it('should call keepHoldings', async () => {
    render(<RemoveFromPackageModals {...defaultProps} isRemoveFromPackageOpen isRemoveHoldingsOpen />);

    const button = screen.getByText('ui-receiving.title.confirmationModal.removeFromPackage.confirm');

    await userEvent.click(button);

    expect(screen.getByText('ui-receiving.title.confirmationModal.removeHolding.heading')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.confirmationModal.removeHolding.message')).toBeDefined();

    const keepHoldings = screen.getByText('ui-receiving.title.confirmationModal.removeHolding.keepHoldings');

    await userEvent.click(keepHoldings);

    expect(onConfirmRemoveFromPackage).toHaveBeenCalledWith({ deleteHoldings: false });
  });

  it('should call deleteHoldings', async () => {
    render(<RemoveFromPackageModals {...defaultProps} isRemoveFromPackageOpen isRemoveHoldingsOpen />);

    const button = screen.getByText('ui-receiving.title.confirmationModal.removeFromPackage.confirm');

    await userEvent.click(button);

    expect(screen.getByText('ui-receiving.title.confirmationModal.removeHolding.heading')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.confirmationModal.removeHolding.message')).toBeDefined();

    const deleteHoldings = screen.getByText('ui-receiving.title.confirmationModal.removeHolding.deleteHoldings');

    await userEvent.click(deleteHoldings);

    expect(onConfirmRemoveFromPackage).toHaveBeenCalledWith({ deleteHoldings: true });
  });
});
