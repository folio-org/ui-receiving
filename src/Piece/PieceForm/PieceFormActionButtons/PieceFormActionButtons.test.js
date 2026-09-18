import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { PIECE_STATUS } from '@folio/stripes-acq-components';

import { ConnectedTasksJobsButton } from '../../../common/components';
import { CONNECTED_RECORD_TYPES } from '../../../common/constants';
import { PieceFormActionButtons } from './PieceFormActionButtons';

jest.mock('../../../common/components', () => ({
  ConnectedTasksJobsButton: jest.fn(() => 'ConnectedTasksJobsButton'),
}));

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

  it('should display Connected Tasks/Jobs in the existing Piece actions menu', async () => {
    const connectedTasksJobsProps = {
      recordId: 'pieceId',
      recordObject: {
        displaySummary: 'Piece summary',
        receiptDate: '2026-09-15',
        receivingStatus: PIECE_STATUS.expected,
      },
      recordType: CONNECTED_RECORD_TYPES.RECEIVING_PIECE,
    };

    renderComponent({ connectedTasksJobsProps, isEditMode: true });

    await user.click(screen.getByTestId('dropdown-trigger-button'));

    expect(screen.getByText('ConnectedTasksJobsButton')).toBeInTheDocument();
    expect(ConnectedTasksJobsButton.mock.calls.map(([props]) => props)).toContainEqual(
      expect.objectContaining({
        ...connectedTasksJobsProps,
        onClick: expect.any(Function),
        variant: 'dropdownItem',
      }),
    );
  });
});
