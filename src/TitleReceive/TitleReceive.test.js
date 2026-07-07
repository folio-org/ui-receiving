import { IntlProvider } from 'react-intl';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  PIECE_COLUMNS,
  RECEIVE_PIECE_VISIBLE_COLUMNS,
} from '../Piece/constants';
import TitleReceive from './TitleReceive';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => 'Loading'),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FieldInventory: jest.fn(() => 'FieldInventory'),
}));
jest.mock('../common/components/LineLocationsView/LineLocationsView', () => jest.fn().mockReturnValue('LineLocationsView'));

const title = 'The American Journal of Medicine';
const note = 'Test receiving note';
const initialValues = {
  receivedItems: [{
    barcode: '10001',
    enumeration: 'The American Journal of Medicine',
    id: '0001',
  }],
};
const poLine = { locations: [{ locationId: '001' }] };
const locations = [{ id: '001', name: 'Annex', code: 'AN' }];

const queryClient = new QueryClient();

const defaultProps = {
  createInventoryValues: {},
  initialValues,
  instanceId: 'instanceId',
  locations,
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  paneTitle: title,
  poLine,
  receivingNote: note,
};

const renderTitleReceive = (props = {}) => render(
  <IntlProvider locale="en">
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <TitleReceive
          {...defaultProps}
          {...props}
        />
      </MemoryRouter>
    </QueryClientProvider>
  </IntlProvider>,
);

describe('Receiving title', () => {
  it('should display title', () => {
    const { getByText } = renderTitleReceive();

    expect(getByText(title)).toBeDefined();
  });

  describe('When there is receiving note - banner is presented', () => {
    it('it should display receiving note banner', () => {
      const { getByText } = renderTitleReceive();

      expect(getByText(note)).toBeDefined();
    });
  });

  describe('When there is no receiving note - banner is not presented', () => {
    it('Receiving note banner is not presented', () => {
      const { queryByText } = renderTitleReceive({ receivingNote: null, paneTitle: title });

      expect(queryByText(note)).toBeNull();
    });
  });

  describe('Loading state', () => {
    it('should display loading when isLoading is true', () => {
      const { getByText } = renderTitleReceive({ isLoading: true });

      expect(getByText('Loading')).toBeDefined();
    });

    it('should not display field array when isLoading is true', () => {
      const { queryByText } = renderTitleReceive({ isLoading: true });

      expect(queryByText('receivedItems')).not.toBeInTheDocument();
    });
  });

  describe('Submit button state', () => {
    it('should disable submit when isPiecesChunksExhausted is true and no items checked', () => {
      const form = {
        mutators: {
          setLocationValue: jest.fn(),
          toggleCheckedAll: jest.fn(),
        },
      };

      const { getByRole } = renderTitleReceive({
        isPiecesChunksExhausted: true,
        form,
        values: { receivedItems: [{ checked: false }] },
      });

      // The submit button should be disabled
      expect(getByRole('button', { name: /save/i })).toBeDisabled();
    });

    it('should enable submit when isPiecesChunksExhausted is false', () => {
      const form = {
        mutators: {
          setLocationValue: jest.fn(),
          toggleCheckedAll: jest.fn(),
        },
      };

      const { getByRole } = renderTitleReceive({
        isPiecesChunksExhausted: false,
        form,
        values: { receivedItems: [{ checked: false }] },
      });

      // The submit button should be enabled when chunks are not exhausted
      expect(getByRole('button', { name: /save/i })).not.toBeDisabled();
    });
  });

  describe('Pane subtitle', () => {
    it('should display paneSub when provided', () => {
      const paneSub = 'Test subtitle';

      const { getByText } = renderTitleReceive({ paneSub });

      expect(getByText(paneSub)).toBeInTheDocument();
    });
  });

  describe('Submit button label', () => {
    it('should display custom submit button label', () => {
      const submitButtonLabel = 'Custom Submit';

      const { getByText } = renderTitleReceive({
        submitButtonLabel,
        form: {
          mutators: {
            setLocationValue: jest.fn(),
            toggleCheckedAll: jest.fn(),
          },
        },
      });

      expect(getByText(submitButtonLabel)).toBeInTheDocument();
    });
  });

  describe('Column manager', () => {
    it('should render a column checkbox for every non-mandatory column', () => {
      renderTitleReceive();

      fireEvent.click(document.querySelector('[data-test-pane-header-actions-button]'));

      RECEIVE_PIECE_VISIBLE_COLUMNS
        .filter((key) => key !== PIECE_COLUMNS.displaySummary)
        .forEach((key) => {
          expect(document.getElementById(`receive-piece-column-checkbox-${key}`)).toBeInTheDocument();
        });
      expect(document.getElementById(`receive-piece-column-checkbox-${PIECE_COLUMNS.displaySummary}`)).not.toBeInTheDocument();
    });

    it('should keep a hidden column field value in form state and restore it when shown again', () => {
      renderTitleReceive();

      // The barcode field is visible by default and shows its initial value.
      expect(screen.getByDisplayValue('10001')).toBeInTheDocument();

      fireEvent.click(document.querySelector('[data-test-pane-header-actions-button]'));

      // Hiding the barcode column unmounts the field, but its value is preserved.
      fireEvent.click(document.getElementById(`receive-piece-column-checkbox-${PIECE_COLUMNS.barcode}`));
      expect(screen.queryByDisplayValue('10001')).not.toBeInTheDocument();

      // Showing it again restores the field with the original value.
      fireEvent.click(document.getElementById(`receive-piece-column-checkbox-${PIECE_COLUMNS.barcode}`));
      expect(screen.getByDisplayValue('10001')).toBeInTheDocument();
    });
  });
});
