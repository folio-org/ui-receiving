import { FormattedMessage } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import DateRangeModalForm from './DateRangeModalForm';

const mockHandleSubmit = jest.fn();
const mockOnCancel = jest.fn();

const defaultProps = {
  confirmLabel: 'confirmButtonLabel',
  handleSubmit: mockHandleSubmit,
  onCancel: mockOnCancel,
  onSubmit: mockHandleSubmit,
  open: true,
  submitting: false,
  values: {
    endDate: '',
    startDate: '',
  },
};

const renderDateRangeModalForm = (props = {}) => render(
  <DateRangeModalForm
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('DateRangeModalForm', () => {
  beforeEach(() => {
    mockHandleSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('should render DateRangeModalForm', () => {
    renderDateRangeModalForm();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.modal.expectedDateRange.heading')).toBeInTheDocument();
  });

  it('should render date fields with correct labels', () => {
    renderDateRangeModalForm();

    expect(screen.getByText('ui-receiving.piece.modal.expectedDateRange.startDate')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.modal.expectedDateRange.endDate')).toBeInTheDocument();
  });

  it('should render with custom confirm label', () => {
    const confirmLabel = <FormattedMessage id="test.confirm" />;

    renderDateRangeModalForm({ confirmLabel });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should handle submit when form is submitted', async () => {
    renderDateRangeModalForm({
      initialValues: {
        startDate: '2023-01-01',
        endDate: '2023-01-15',
      },
    });

    await userEvent.click(screen.getByRole('button', { name: defaultProps.confirmLabel }));

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('should disable confirm button when disabled prop is true', () => {
    renderDateRangeModalForm({ disabled: true });

    const confirmButton = screen.getByRole('button', { name: /confirm/i });

    expect(confirmButton).toBeDisabled();
  });

  it('should handle custom date field names', () => {
    renderDateRangeModalForm({
      startDateName: 'customStartDate',
      endDateName: 'customEndDate',
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should handle date field requirements', async () => {
    renderDateRangeModalForm({
      startDateRequired: false,
      endDateRequired: false,
    });

    await userEvent.click(screen.getByRole('button', { name: defaultProps.confirmLabel }));

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('should not render when open is false', () => {
    renderDateRangeModalForm({ open: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
