import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';
import { VENDORS_API } from '@folio/stripes-acq-components';

import { useOrganizationsBatch } from './useOrganizationsBatch';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const organizations = [
  { id: '1', name: 'Foo' },
  { id: '2', name: 'Bar' },
];
const organizationIds = organizations.map(({ id }) => id);

describe('useOrganizationsBatch', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({ organizations }),
  }));

  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: mockGet,
      });
  });

  it('should batch fetch organizations by IDs', async () => {
    const { result, waitFor } = renderHook(() => useOrganizationsBatch(organizationIds), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.organizations).toEqual(organizations);
    expect(mockGet).toHaveBeenCalledWith(VENDORS_API, {
      searchParams: expect.objectContaining({
        query: organizationIds.map(id => `id==${id}`).join(' or '),
      }),
    });
  });
});
