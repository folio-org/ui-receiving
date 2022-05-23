import { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useShowCallout } from '@folio/stripes-acq-components';

import {
  EXPORT_FIELDS_PARAMS,
  EXPORT_SETTINGS_FIELDS,
} from './constants';
import {
  usePiecesExportCSV,
} from './hooks';
import {
  getExportFields,
} from './utils';
import ExportSettingsModal from './ExportSettingsModal';

export const ExportSettingsModalContainer = ({
  onCancel,
  query,
}) => {
  const showCallout = useShowCallout();
  const {
    runExportCSV,
    isLoading,
  } = usePiecesExportCSV();

  const initialValues = {
    [EXPORT_SETTINGS_FIELDS.exportTitleFields]: EXPORT_FIELDS_PARAMS.all,
    [EXPORT_SETTINGS_FIELDS.exportPieceFields]: EXPORT_FIELDS_PARAMS.all,
  };

  const onSubmit = useCallback((formValues) => {
    const exportFields = getExportFields(formValues);

    showCallout({ messageId: 'ui-receiving.exportSettings.success' });
    runExportCSV({
      exportFields,
      query,
    })
      .catch(() => showCallout({ messageId: 'ui-receiving.exportSettings.error', type: 'error' }))
      .finally(onCancel);
  }, [onCancel, runExportCSV, showCallout, query]);

  return (
    <ExportSettingsModal
      initialValues={initialValues}
      isExporting={isLoading}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  );
};

ExportSettingsModalContainer.propTypes = {
  onCancel: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};
