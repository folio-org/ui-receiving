import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { PIECE_STATUS } from '@folio/stripes-acq-components';

import { PieceFormActionButtons } from './PieceFormActionButtons';

const onSave = jest.fn();
const onDelete = jest.fn();

const defaultProps = {
  disabled: false,
  isCreateAnother: false,
  onDelete,
  onSave,
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
});
