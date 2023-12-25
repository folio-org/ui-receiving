import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { useShowCallout } from '@folio/stripes-acq-components';

import {
  usePiecesExpect,
  useTitleHydratedPieces,
} from '../common/hooks';
import { TITLE_EXPECT_PIECES_VISIBLE_COLUMNS } from './constants';
import { TitleExpectContainer } from './TitleExpectContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));

jest.mock('../common/hooks', () => ({
  ...jest.requireActual('../common/hooks'),
  usePiecesExpect: jest.fn(),
  useTitleHydratedPieces: jest.fn(),
}));

const title = {
  title: 'Test title',
  id: '001',
  poLineId: '002',
};
const orderLine = {
  id: '002',
  locations: [{ locationId: '1' }],
  poLineNumber: '10002-2',
};
const pieces = [{ id: '01', locationId: '1' }];

const defaultProps = {
  history: { push: jest.fn() },
  location: { search: 'search' },
  match: {
    params: { id: title.id },
  },
};

const renderTitleExpectContainer = (props = {}) => render(
  <TitleExpectContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('TitleUnreceiveContainer', () => {
  const callout = jest.fn();
  const expectPieces = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    defaultProps.history.push.mockClear();
    expectPieces.mockClear();
    usePiecesExpect
      .mockClear()
      .mockReturnValue({ expectPieces });
    useShowCallout
      .mockClear()
      .mockReturnValue(callout);
    useTitleHydratedPieces
      .mockClear()
      .mockReturnValue({
        orderLine,
        pieceHoldingMap: {},
        pieceLocationMap: {},
        pieces,
        title,
      });
  });

  it('should render loading pane', async () => {
    useTitleHydratedPieces.mockReturnValue({ isLoading: true });

    renderTitleExpectContainer();

    screen.debug();
  });

  it('should render unreceivable pieces list', async () => {
    renderTitleExpectContainer();

    TITLE_EXPECT_PIECES_VISIBLE_COLUMNS.slice(1).forEach((column) => {
      expect(screen.getByText(`ui-receiving.piece.${column}`)).toBeInTheDocument();
    });
  });

  it('should call \'expectPieces\' with the list of selected pieces', async () => {
    renderTitleExpectContainer();

    // "Select all" check
    await user.click(screen.getByLabelText('ui-receiving.piece.actions.selectAll'));
    // "Expect" selected pieces
    await user.click(screen.getByRole('button', { name: 'ui-receiving.title.details.button.expect' }));

    expect(expectPieces).toHaveBeenCalled();
    expect(callout).toHaveBeenCalledWith({ messageId: 'ui-receiving.title.actions.expect.success' });
  });

  it('should handle \'expectPieces\' error', async () => {
    expectPieces.mockRejectedValue();
    renderTitleExpectContainer();

    // "Select all" check
    await user.click(screen.getByLabelText('ui-receiving.piece.actions.selectAll'));
    // "Expect" selected pieces
    await user.click(screen.getByRole('button', { name: 'ui-receiving.title.details.button.expect' }));

    expect(callout).toHaveBeenCalledWith({
      messageId: 'ui-receiving.title.actions.expect.error',
      type: 'error',
    });
  });

  it('should navigate back to the title when form canceled', async () => {
    renderTitleExpectContainer();

    await user.click(screen.getByRole('button', { name: 'stripes-acq-components.FormFooter.cancel' }));

    expect(defaultProps.history.push).toHaveBeenCalledWith({
      pathname: `/receiving/${title.id}/view`,
      search: defaultProps.location.search,
    });
  });
});
