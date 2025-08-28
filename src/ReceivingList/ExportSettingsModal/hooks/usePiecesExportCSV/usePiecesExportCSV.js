import moment from 'moment';
import { useIntl } from 'react-intl';
import { useMutation } from 'react-query';

import { exportToCsv } from '@folio/stripes/components';
import {
  useOkapiKy,
  useNamespace,
  useStripes,
} from '@folio/stripes/core';
import { useCentralOrderingContext } from '@folio/stripes-acq-components';

import {
  EXPORT_PIECE_FIELDS,
  EXPORT_TITLE_FIELDS,
} from '../../constants';
import {
  createExportReport,
  getExportData,
} from '../../utils';

export const usePiecesExportCSV = ({ tenantId, signal } = {}) => {
  const intl = useIntl();
  const ky = useOkapiKy({ tenant: tenantId });
  const stripes = useStripes();
  const [namespace] = useNamespace({ key: 'pieces-export-csv' });
  const { isCentralOrderingEnabled } = useCentralOrderingContext();

  const configs = {
    isCentralOrderingEnabled,
    stripes,
  };

  const mutationKey = [namespace];
  const mutationFn = async ({
    exportFields,
    query,
  }) => {
    const exportData = await getExportData(ky.extend({ signal }), configs)({ exportFields, query });
    const exportReport = createExportReport(exportData, { intl });

    const filename = `receiving-export-${moment().format('YYYY-MM-DD-hh:mm')}`;

    exportToCsv(
      [{ ...EXPORT_TITLE_FIELDS, ...EXPORT_PIECE_FIELDS }, ...exportReport],
      {
        onlyFields: exportFields,
        header: false,
        filename,
      },
    );
  };

  const {
    isLoading,
    mutateAsync: runExportCSV,
  } = useMutation({ mutationKey, mutationFn });

  return {
    runExportCSV,
    isLoading,
  };
};
