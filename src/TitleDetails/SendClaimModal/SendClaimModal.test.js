import moment from 'moment';
import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import SendClaimModal from './SendClaimModal';

const FORMAT = 'MM/DD/YYYY';
const today = moment();

const defaultProps = {
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  open: true,
};

const renderSendClaimModal = (props = {}) => render(
  <SendClaimModal
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('SendClaimModal', () => {
  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    defaultProps.onSubmit.mockClear();
  });

  it('should render send claim modal', () => {
    renderSendClaimModal();

    expect(screen.getByText('ui-receiving.modal.sendClaim.heading')).toBeInTheDocument();
  });

  it('should validate "Claim expiry date" field', async () => {
    renderSendClaimModal();

    const saveBtn = screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.save' });

    await user.click(saveBtn);
    expect(screen.getByText('stripes-acq-components.validation.required')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(FORMAT), today.format(FORMAT));
    await user.click(saveBtn);
    expect(screen.getByText('ui-receiving.validation.dateAfter')).toBeInTheDocument();
  });

  it('should submit valid form', async () => {
    renderSendClaimModal();

    const date = today.add(5, 'days');
    const internalNote = 'Internal';
    const externalNote = 'External';

    await user.type(screen.getByPlaceholderText(FORMAT), date.format(FORMAT));
    await user.type(screen.getByLabelText('ui-receiving.piece.internalNote'), internalNote);
    await user.type(screen.getByLabelText('ui-receiving.piece.externalNote'), externalNote);
    await user.click(screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.save' }));

    expect(defaultProps.onSubmit).toHaveBeenCalledWith(
      {
        claimingDate: date.format('YYYY-MM-DD'),
        internalNote,
        externalNote,
      },
      expect.anything(),
      expect.anything(),
    );
  });

  it('should call "onCancel" when the modal dismissed', async () => {
    renderSendClaimModal();

    await user.click(screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.cancel' }));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
