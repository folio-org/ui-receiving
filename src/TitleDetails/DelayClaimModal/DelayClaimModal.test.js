import moment from 'moment';
import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import DelayClaimModal from './DelayClaimModal';

const FORMAT = 'MM/DD/YYYY';
const today = moment();

const defaultProps = {
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  open: true,
};

const renderDelayClaimModal = (props = {}) => render(
  <DelayClaimModal
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('DelayClaimModal', () => {
  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    defaultProps.onSubmit.mockClear();
  });

  it('should render delay claim modal', () => {
    renderDelayClaimModal();

    expect(screen.getByText('ui-receiving.modal.delayClaim.heading')).toBeInTheDocument();
  });

  it('should validate "Delay to" field', async () => {
    renderDelayClaimModal();

    const saveBtn = screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.save' });

    await user.click(saveBtn);
    expect(screen.getByText('stripes-acq-components.validation.required')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(FORMAT), today.format(FORMAT));
    await user.click(saveBtn);
    expect(screen.getByText('ui-receiving.validation.dateAfter')).toBeInTheDocument();
  });

  it('should submit valid form', async () => {
    renderDelayClaimModal();

    const date = today.add(3, 'days');

    await user.type(screen.getByPlaceholderText(FORMAT), date.format(FORMAT));
    await user.click(screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.save' }));

    expect(defaultProps.onSubmit).toHaveBeenCalledWith(
      { claimingDate: date.format('YYYY-MM-DD') },
      expect.anything(),
      expect.anything(),
    );
  });

  it('should call "onCancel" when the modal dismissed', async () => {
    renderDelayClaimModal();

    await user.click(screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.cancel' }));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
