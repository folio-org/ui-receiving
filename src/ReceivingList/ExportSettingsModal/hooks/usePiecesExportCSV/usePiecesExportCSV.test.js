import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';
import { exportToCsv } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';

import { usePiecesExportCSV } from './usePiecesExportCSV';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  exportToCsv: jest.fn(),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  extend: () => kyMock,
  get: () => ({
    json: () => ({}),
  }),
};

describe('usePiecesExportCSV', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it('should return a function, that run export to csv', async () => {
    const { result } = renderHook(
      () => usePiecesExportCSV({}),
      { wrapper },
    );

    await act(async () => result.current.runExportCSV({ exportFields: [], query: '' }));

    expect(exportToCsv).toHaveBeenCalled();
  });
});
