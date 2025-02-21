import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import NumberGeneratorButton from './NumberGeneratorButton';

const mockOnClick = jest.fn();

const defaultProps = {
  onClick: mockOnClick,
  tooltipId: 'test-tooltip',
  tooltipLabel: 'Generate Number',
};

describe('Render NumberGeneratorButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the button with tooltip', async () => {
    render(<NumberGeneratorButton {...defaultProps} disabled={false} />);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();

    await userEvent.hover(button);
    expect(await screen.findByText('Generate Number')).toBeInTheDocument();
  });

  it('should call onClick if clicking button', async () => {
    render(<NumberGeneratorButton {...defaultProps} disabled={false} />);

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled if disabled prop is true', () => {
    render(<NumberGeneratorButton {...defaultProps} disabled />);

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });
});
