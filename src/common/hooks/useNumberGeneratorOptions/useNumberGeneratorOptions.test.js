import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import {
  GENERATOR_OFF,
  GENERATOR_ON_EDITABLE,
  NUMBER_GENERATOR_SETTINGS_KEY,
} from '../../constants';
import { useNumberGeneratorOptions } from './useNumberGeneratorOptions';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const NUMBER_GENERATOR = {
  barcode: GENERATOR_OFF,
  accessionNumber: GENERATOR_ON_EDITABLE,
  callNumber: GENERATOR_ON_EDITABLE,
  useSharedNumber: false,
};

const mockData = {
  id: '8cc688c4-e7da-438e-98a7-d101cad104f4',
  key: NUMBER_GENERATOR_SETTINGS_KEY,
  value: JSON.stringify(NUMBER_GENERATOR),
};

describe('useNumberGeneratorOptions', () => {
  beforeEach(() => {
    queryClient.clear();
    useOkapiKy.mockClear();
  });

  it('should fetch and normalize number generator options', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: jest.fn(() => ({
          json: jest.fn().mockResolvedValue({ settings: [mockData] }),
        })),
      });

    const { result } = renderHook(() => useNumberGeneratorOptions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current).toEqual(expect.objectContaining({
      isLoading: false,
      data: NUMBER_GENERATOR,
    }));
  });

  it('should return default values when data is missing', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: jest.fn(() => ({
          json: jest.fn().mockResolvedValue({ settings: [{ }] }),
        })),
      });

    const { result } = renderHook(() => useNumberGeneratorOptions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.data).toEqual({
      accessionNumber: '',
      barcode: '',
      callNumber: '',
      useSharedNumber: false,
    });
  });

  it('should handle partial data', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: jest.fn(() => ({
          json: jest.fn().mockResolvedValue({ settings: [{ value: JSON.stringify({ accessionNumber: '1234' }) }] }),
        })),
      });

    const { result } = renderHook(() => useNumberGeneratorOptions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.data).toEqual({
      accessionNumber: '1234',
      barcode: '',
      callNumber: '',
      useSharedNumber: false,
    });
  });
});
