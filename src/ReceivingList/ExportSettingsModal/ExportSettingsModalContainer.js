import PropTypes from 'prop-types';
import {
  useCallback,
  useRef,
} from 'react';

import { useShowCallout } from '@folio/stripes-acq-components';

import { useReceivingSearchContext } from '../../contexts';
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
  onCancel: onCancelProp,
  query,
}) => {
  const abortControllerRef = useRef(new AbortController());
  const showCallout = useShowCallout();
  const { targetTenantId } = useReceivingSearchContext();
  const {
    runExportCSV,
    isLoading,
  } = usePiecesExportCSV({
    tenantId: targetTenantId,
    signal: abortControllerRef.current.signal,
  });

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
      .then(onCancelProp)
      .catch(() => {
        if (!abortControllerRef.current.signal.aborted) {
          showCallout({ messageId: 'ui-receiving.exportSettings.error', type: 'error' });
        }
      });
  }, [onCancelProp, runExportCSV, showCallout, query]);

  const onCancel = useCallback(() => {
    abortControllerRef.current.abort();
    onCancelProp();
  }, [onCancelProp]);

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
