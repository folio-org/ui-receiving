import { useCallback } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import {
  EXPORT_FIELDS_PARAMS,
  EXPORT_SETTINGS_FIELDS,
} from './constants';
import {
  getExportFields,
} from './utils';
import ExportSettingsModal from './ExportSettingsModal';

export const ExportSettingsModalContainer = ({
  onCancel,
}) => {
  const initialValues = {
    [EXPORT_SETTINGS_FIELDS.exportTitleFields]: EXPORT_FIELDS_PARAMS.all,
    [EXPORT_SETTINGS_FIELDS.exportPieceFields]: EXPORT_FIELDS_PARAMS.all,
  };

  const onSubmit = useCallback((formValues) => {
    const exportFields = getExportFields(formValues);

    noop(exportFields);
    onCancel();
  }, [onCancel]);

  return (
    <ExportSettingsModal
      initialValues={initialValues}
      isExporting={false}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  );
};

ExportSettingsModalContainer.propTypes = {
  onCancel: PropTypes.func.isRequired,
};
