import moment from 'moment';
import { useIntl } from 'react-intl';
import { useMutation } from 'react-query';

import { exportToCsv } from '@folio/stripes/components';
import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import {
  EXPORT_PIECE_FIELDS,
  EXPORT_TITLE_FIELDS,
} from '../../constants';
import {
  createExportReport,
  getExportData,
} from '../../utils';

export const usePiecesExportCSV = () => {
  const intl = useIntl();
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'pieces-export-csv' });

  const mutationKey = [namespace];
  const mutationFn = async ({
    exportFields,
    query,
  }) => {
    const exportData = await getExportData(ky)({ exportFields, query });
    const exportReport = createExportReport(exportData, { intl });

    const filename = `pieces-export-${moment().format('YYYY-MM-DD-hh:mm')}`;

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
