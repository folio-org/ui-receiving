import { MemoryRouter } from 'react-router-dom';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { ReceivingListActionMenu } from './ReceivingListActionMenu';

const defaultProps = {
  onToggle: jest.fn(),
  titlesCount: 42,
  toggleExportModal: jest.fn(),
};

const renderReceivingListActionMenu = (props = {}) => render(
  <ReceivingListActionMenu
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('ReceivingListActionMenu', () => {
  beforeEach(() => {
    defaultProps.onToggle.mockClear();
    defaultProps.toggleExportModal.mockClear();
  });

  it('should render action menu items', () => {
    renderReceivingListActionMenu();

    expect(screen.getByLabelText('stripes-smart-components.addNew')).toBeInTheDocument();
    expect(screen.getByLabelText('ui-receiving.title.actions.exportCSV')).toBeInTheDocument();
  });

  it('should open export settings modal', async () => {
    renderReceivingListActionMenu();

    await user.click(screen.getByTestId('export-csv-button'));

    expect(defaultProps.toggleExportModal).toHaveBeenCalled();
  });
});
