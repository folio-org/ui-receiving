import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { usePiece } from '../../common/hooks';
import { PieceFormContainer } from '../PieceForm';
import { PieceEdit } from './PieceEdit';

jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  usePiece: jest.fn(),
}));
jest.mock('../../contexts', () => ({
  ...jest.requireActual('../../contexts'),
  useReceivingSearchContext: jest.fn(() => ({ targetTenantId: 'tenantId' })),
}));
jest.mock('../PieceForm', () => ({
  PieceFormContainer: jest.fn(() => 'PieceFormContainer'),
}));

const defaultProps = {
  location: {},
  match: {
    params: { id: 'titleId' },
  },
};

const renderComponent = (props = {}) => render(
  <PieceEdit
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('PieceCreate', () => {
  beforeEach(() => {
    PieceFormContainer.mockClear();

    usePiece
      .mockClear()
      .mockReturnValue({ piece: {} });
  });

  it('should render piece edit form', () => {
    renderComponent();

    expect(screen.getByText('PieceFormContainer')).toBeInTheDocument();
  });
});
