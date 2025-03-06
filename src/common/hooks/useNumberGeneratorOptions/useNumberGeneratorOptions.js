import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { ORDERS_STORAGE_SETTINGS_API } from '@folio/stripes-acq-components';

import { NUMBER_GENERATOR_SETTINGS_KEY } from '../../constants';

const parseAndNormalizeNumberGeneratorData = (data) => {
  if (!data) return { accessionNumber: '', barcode: '', callNumber: '', useSharedNumber: false };

  const parsedData = typeof data.value === 'string' ? JSON.parse(data.value) : data.value || {};

  return {
    accessionNumber: parsedData.accessionNumber || '',
    barcode: parsedData.barcode || '',
    callNumber: parsedData.callNumber || '',
    useSharedNumber: parsedData.useSharedNumber ?? false,
  };
};

export const useNumberGeneratorOptions = (options = {}) => {
  const { tenantId } = options;
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'number-generator-options' });

  const searchParams = {
    limit: 1,
    query: `key=${NUMBER_GENERATOR_SETTINGS_KEY}`,
  };

  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: async ({ signal }) => {
      const response = await ky.get(ORDERS_STORAGE_SETTINGS_API, { searchParams, signal }).json();

      if (!response?.settings || !Array.isArray(response.settings)) {
        return null;
      }

      return response?.settings?.[0];
    },
  });

  const normalizedData = parseAndNormalizeNumberGeneratorData(data);

  return ({
    data: normalizedData,
    isLoading,
    refetch,
  });
};
