import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { ExportSettingsModalContainer } from './ExportSettingsModalContainer';

const defaultProps = {
  onCancel: jest.fn(),
};

const renderExportSettingsModalContainer = (props = {}) => render(
  <ExportSettingsModalContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('ExportSettingsModalContainer', () => {
  it('should render Export Settings Modal', () => {
    renderExportSettingsModalContainer();

    expect(screen.getByText('ui-receiving.exportSettings.label')).toBeDefined();
  });
});

describe('ExportSettingsModal actions', () => {
  beforeEach(() => {
    defaultProps.onCancel.mockClear();
  });

  describe('Close modal', () => {
    it('should close modal when cancel button clicked', () => {
      renderExportSettingsModalContainer();

      user.click(screen.getByText('stripes-core.button.cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Export', () => {
    it('should exporting and close modal when \'Export\' button clicked', () => {
      renderExportSettingsModalContainer();

      user.click(screen.getByText('ui-receiving.exportSettings.export'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });
});
