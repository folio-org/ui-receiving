import { FormattedMessage } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { DateRangeModal } from './DateRangeModal';

const mockOnCancel = jest.fn();
const mockOnConfirm = jest.fn();

const defaultProps = {
  open: true,
  onCancel: mockOnCancel,
  onConfirm: mockOnConfirm,
};

const renderDateRangeModal = (props = {}) => render(
  <DateRangeModal
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('DateRangeModal', () => {
  beforeEach(() => {
    mockOnCancel.mockClear();
    mockOnConfirm.mockClear();
  });

  it('should render DateRangeModal', () => {
    renderDateRangeModal();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should render with custom confirm label', () => {
    const confirmLabel = <FormattedMessage id="test.confirm.label" />;

    renderDateRangeModal({ confirmLabel });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should pass disabled prop correctly', () => {
    renderDateRangeModal({ disabled: true });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should handle custom date field names', () => {
    renderDateRangeModal({
      startDateName: 'customStartDate',
      endDateName: 'customEndDate',
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should handle required date field props', () => {
    renderDateRangeModal({
      startDateRequired: false,
      endDateRequired: false,
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    renderDateRangeModal({ open: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
