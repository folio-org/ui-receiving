import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import {
  EXPORT_FIELDS_PARAMS,
  EXPORT_SETTINGS_FIELDS,
} from './constants';
import ExportSettingsModal from './ExportSettingsModal';

const defaultProps = {
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  initialValues: {
    [EXPORT_SETTINGS_FIELDS.exportTitleFields]: EXPORT_FIELDS_PARAMS.all,
    [EXPORT_SETTINGS_FIELDS.exportPieceFields]: EXPORT_FIELDS_PARAMS.all,
  },
  isExporting: false,
};

const renderExportSettingsModal = (props = {}) => render(
  <ExportSettingsModal
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('ExportSettingsModal', () => {
  it('should render Export Settings Modal', () => {
    renderExportSettingsModal();

    expect(screen.getByText('ui-receiving.exportSettings.label')).toBeDefined();
  });
});

describe('ExportSettingsModal actions', () => {
  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    defaultProps.onSubmit.mockClear();
  });

  describe('selected fields', () => {
    // flaky test fails on master branch
    it.skip('should select an option item if it was clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getAllByRole('radio')[1]);

      const radioBtns = await screen.findAllByRole('radio');

      expect(radioBtns[0].checked).toBeFalsy();
      expect(radioBtns[1].checked).toBeTruthy();

      const selects = await screen.findAllByRole('textbox');

      await user.click(selects[0]);

      const options = await screen.findAllByRole('option');

      await user.click(options[0]);

      expect(options[0].getAttribute('aria-selected')).toBeTruthy();
    });
  });

  describe('all fields', () => {
    it('should select all Invoice fields when the corresponding radio button was clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getAllByRole('radio')[1]);
      await user.click(screen.getAllByRole('radio')[0]);

      const radioBtns = await screen.findAllByRole('radio');

      expect(radioBtns[0].checked).toBeTruthy();
    });

    it('should select all Invoice lines fields when the corresponding radio button was clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getAllByRole('radio')[3]);
      await user.click(screen.getAllByRole('radio')[2]);

      const radioBtns = await screen.findAllByRole('radio');

      expect(radioBtns[2].checked).toBeTruthy();
    });
  });

  describe('Close modal', () => {
    it('should close modal when cancel button clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getByText('stripes-core.button.cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Export', () => {
    it('should exporting when \'Export\' button clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getByText('ui-receiving.exportSettings.export'));

      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });
  });
});
