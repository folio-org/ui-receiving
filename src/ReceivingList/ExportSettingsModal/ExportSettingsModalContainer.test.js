import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { usePiecesExportCSV } from './hooks';
import { ExportSettingsModalContainer } from './ExportSettingsModalContainer';

jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  usePiecesExportCSV: jest.fn(),
}));

const defaultProps = {
  onCancel: jest.fn(),
  query: '',
};

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderExportSettingsModalContainer = (props = {}) => render(
  <ExportSettingsModalContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

const mockExportCSV = {
  isLoading: false,
  runExportCSV: jest.fn(() => Promise.resolve({})),
};

describe('ExportSettingsModalContainer', () => {
  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    mockExportCSV.runExportCSV.mockClear();
    usePiecesExportCSV.mockClear().mockReturnValue(mockExportCSV);
  });

  it('should render Export Settings Modal', () => {
    renderExportSettingsModalContainer();

    expect(screen.getByText('ui-receiving.exportSettings.label')).toBeDefined();
  });

  describe('ExportSettingsModal actions', () => {
    describe('Close modal', () => {
      it('should close modal when cancel button clicked', () => {
        renderExportSettingsModalContainer();

        user.click(screen.getByText('stripes-core.button.cancel'));

        expect(defaultProps.onCancel).toHaveBeenCalled();
      });
    });

    describe('Export', () => {
      it('should call \'runExportCSV\' when \'Export\' button clicked', () => {
        renderExportSettingsModalContainer();

        user.click(screen.getByText('ui-receiving.exportSettings.export'));

        expect(mockExportCSV.runExportCSV).toHaveBeenCalled();
      });

      it('should catch an error if it is occured during export process', () => {
        const error = 'someError';

        mockExportCSV.runExportCSV.mockRejectedValue(error);

        renderExportSettingsModalContainer();

        user.click(screen.getByText('ui-receiving.exportSettings.export'));

        expect(mockExportCSV.runExportCSV).rejects.toEqual(error);
      });
    });
  });
});
