import user from '@folio/jest-config-stripes/testing-library/user-event';
import { screen } from '@folio/jest-config-stripes/testing-library/react';

import { renderWithRouter } from '../../../test/jest/helpers';
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

const renderExportSettingsModalContainer = (props = {}) => renderWithRouter(
  <ExportSettingsModalContainer
    {...defaultProps}
    {...props}
  />,
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
      it('should close modal when cancel button clicked', async () => {
        renderExportSettingsModalContainer();

        await user.click(screen.getByText('stripes-core.button.cancel'));

        expect(defaultProps.onCancel).toHaveBeenCalled();
      });
    });

    describe('Export', () => {
      it('should call \'runExportCSV\' when \'Export\' button clicked', async () => {
        renderExportSettingsModalContainer();

        await user.click(screen.getByText('ui-receiving.exportSettings.export'));

        expect(mockExportCSV.runExportCSV).toHaveBeenCalled();
      });

      it('should catch an error if it is occured during export process', async () => {
        const error = 'someError';

        mockExportCSV.runExportCSV.mockRejectedValue(error);

        renderExportSettingsModalContainer();

        await user.click(screen.getByText('ui-receiving.exportSettings.export'));

        expect(mockExportCSV.runExportCSV).rejects.toEqual(error);
      });
    });
  });
});
