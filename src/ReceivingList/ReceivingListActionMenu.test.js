import { MemoryRouter } from 'react-router-dom';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { ReceivingListActionMenu } from './ReceivingListActionMenu';
import {
  RECEIVING_COLUMNS,
  RECEIVING_VISIBLE_COLUMNS,
} from './constants';

const defaultProps = {
  onToggle: jest.fn(),
  titlesCount: 42,
  toggleColumn: jest.fn(),
  toggleExportModal: jest.fn(),
  visibleColumns: RECEIVING_VISIBLE_COLUMNS,
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
    defaultProps.toggleColumn.mockClear();
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

  it('should render a column manager checkbox for every non-mandatory column', () => {
    renderReceivingListActionMenu();

    Object.values(RECEIVING_COLUMNS)
      .filter(key => key !== RECEIVING_COLUMNS.TITLE)
      .forEach(key => {
        expect(document.getElementById(`receiving-list-column-checkbox-${key}`)).toBeInTheDocument();
      });
    expect(document.getElementById(`receiving-list-column-checkbox-${RECEIVING_COLUMNS.TITLE}`)).not.toBeInTheDocument();
  });

  it('should toggle a column when the checkbox is clicked', async () => {
    renderReceivingListActionMenu();

    await user.click(document.getElementById(`receiving-list-column-checkbox-${RECEIVING_COLUMNS.LOCATIONS}`));

    expect(defaultProps.toggleColumn).toHaveBeenCalledWith(RECEIVING_COLUMNS.LOCATIONS);
  });
});
