import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { getFullName } from '@folio/stripes/util';
import { PIECE_STATUS } from '@folio/stripes-acq-components';

import { CLAIMING_JOB_SYNTHETIC_USER_ID } from '../../../common/constants';
import { usePieceStatusChangeLog } from '../../hooks';
import { ReceivingStatusChangeLog } from './ReceivingStatusChangeLog';

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  usePieceStatusChangeLog: jest.fn(),
}));

const defaultProps = {
  piece: { id: 'piece-id' },
};
const user = {
  id: 'user-1',
  personal: {
    lastName: 'Galt',
    firstName: 'John',
  },
};
const data = [
  {
    eventDate: '2023-12-26T14:08:19.402Z',
    user,
    receivingStatus: PIECE_STATUS.received,
  },
  {
    eventDate: '2023-12-25T14:08:18.402Z',
    user,
    receivingStatus: PIECE_STATUS.expected,
  },
];

const renderComponent = (props = {}) => render(
  <ReceivingStatusChangeLog
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('ReceivingStatusChangeLog', () => {
  beforeEach(() => {
    usePieceStatusChangeLog
      .mockClear()
      .mockReturnValue({ data });
  });

  it('should render piece status log list', () => {
    renderComponent();

    expect(screen.getByText('ui-receiving.piece.statusChangeLog.column.status')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.statusChangeLog.column.date')).toBeInTheDocument();
    expect(screen.getByText('ui-receiving.piece.statusChangeLog.column.updatedBy')).toBeInTheDocument();
  });

  describe('Updated by', () => {
    it('should render personal data for an updater', () => {
      renderComponent();

      expect(screen.getAllByText(getFullName(user).trim())).toHaveLength(data.length);
    });

    it('should render "System" label if the updater is the synthetic user', () => {
      usePieceStatusChangeLog.mockReturnValue({
        data: [{ ...data[0], user: { id: CLAIMING_JOB_SYNTHETIC_USER_ID } }],
      });

      renderComponent();

      expect(screen.getByText('ui-receiving.systemUser.label')).toBeInTheDocument();
    });

    it('should render "Invalid reference" label if the updater is not found', () => {
      usePieceStatusChangeLog.mockReturnValue({
        data: [{ ...data[0], user: undefined }],
      });

      renderComponent();

      expect(screen.getByText('stripes-acq-components.invalidReference')).toBeInTheDocument();
    });
  });
});
