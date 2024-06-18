import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { HasCommand } from '@folio/stripes/components';

import TitleBindPieces from './TitleBindPieces';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('./TitleBindPiecesCreateItemForm', () => ({
  TitleBindPiecesCreateItemForm: jest.fn(() => 'TitleBindPiecesCreateItemForm'),
}));

const initialValues = {
  receivedItems: [{
    barcode: '10001',
    enumeration: 'The American Journal of Medicine',
    id: '0001',
  }],
};
const defaultProps = {
  onCancel: jest.fn(),
  form: {},
  onSubmit: jest.fn(),
  pristine: false,
  submitting: false,
  paneTitle: 'TitleBindPieces',
  pieceLocationMap: {},
  initialValues,
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderTitleBindPieces = (props = defaultProps) => render(
  <TitleBindPieces
    {...props}
  />,
  { wrapper },
);

describe('TitleBindPieces', () => {
  it('should display title TitleBindPieces', () => {
    renderTitleBindPieces();

    expect(screen.getByText(defaultProps.paneTitle)).toBeDefined();
  });

  it('should display pane footer', () => {
    renderTitleBindPieces();

    expect(screen.getByText('stripes-acq-components.FormFooter.cancel')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.details.button.bind')).toBeDefined();
  });

  it('should close Title TitleBindPieces', async () => {
    renderTitleBindPieces();

    await user.click(screen.getByText('stripes-acq-components.FormFooter.cancel'));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      defaultProps.onCancel.mockClear();
    });

    it('should cancel form when cancel shortcut is called', () => {
      renderTitleBindPieces();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });
});
