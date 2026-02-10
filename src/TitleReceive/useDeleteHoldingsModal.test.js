import {
  act,
  renderHook,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useConsortiumTenants } from '@folio/stripes-acq-components';

import { useDeleteHoldingsModal } from './useDeleteHoldingsModal';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useConsortiumTenants: jest.fn(),
}));

describe('useDeleteHoldingsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useConsortiumTenants.mockReturnValue({ tenants: [] });
  });

  it('should initialize with modal not rendered when isModalOpen is false', () => {
    const { result } = renderHook(() => useDeleteHoldingsModal());

    expect(result.current.modal).toBeFalsy();
  });

  describe('initDeleteHoldingsModal', () => {
    it('should open modal and return a promise when initDeleteHoldingsModal is called', async () => {
      const { result } = renderHook(() => useDeleteHoldingsModal());
      const abandonedHoldingsResults = [{ id: 'holding-1' }];
      const holdings = [{ id: 'holding-1', permanentLocationId: 'location-1' }];
      const locations = [{ id: 'location-1', name: 'Main Library' }];

      let promise;

      act(() => {
        promise = result.current.initDeleteHoldingsModal(
          abandonedHoldingsResults,
          holdings,
          locations,
        );
      });
      expect(result.current.modal).toBeTruthy();
      expect(promise).toBeInstanceOf(Promise);

      // Render modal and check content
      render(result.current.modal);
      expect(screen.getByText(/Main Library/)).toBeInTheDocument();
    });

    it.each([
      ['Keep holdings', 'keepHoldings', false],
      ['Delete holdings', 'holdings.deleteModal.heading', true],
    ])('should handle confirm actions: %s', async (_action, label, expected) => {
      const { result } = renderHook(() => useDeleteHoldingsModal());
      const abandonedHoldingsResults = [{ id: 'holding-1' }];
      const holdings = [{ id: 'holding-1', permanentLocationId: 'location-1' }];
      const locations = [{ id: 'location-1', name: 'Main Library' }];

      let promise;

      act(() => {
        promise = result.current.initDeleteHoldingsModal(
          abandonedHoldingsResults,
          holdings,
          locations,
        );
      });
      render(result.current.modal);

      // Simulate user confirming the modal (keeping holdings)
      const confirmButton = screen.getByRole('button', { name: new RegExp(label, 'i') });

      await act(async () => {
        await userEvent.click(confirmButton);
      });

      expect(await promise).toBe(expected);
    });

    it('should not include tenant names when crossTenant is false', () => {
      const tenants = [{ id: 'tenant-1', name: 'Tenant One' }];

      useConsortiumTenants.mockReturnValue({ tenants });
      const { result } = renderHook(() => useDeleteHoldingsModal({ crossTenant: false }));
      const abandonedHoldingsResults = [{ id: 'holding-1' }];
      const holdings = [{ id: 'holding-1', permanentLocationId: 'location-1', tenantId: 'tenant-1' }];
      const locations = [{ id: 'location-1', name: 'Main Library' }];

      act(() => {
        result.current.initDeleteHoldingsModal(
          abandonedHoldingsResults,
          holdings,
          locations,
        );
      });
      expect(result.current.modal).toBeTruthy();
      render(result.current.modal);
      expect(screen.getByText(/Main Library/)).toBeInTheDocument();
      expect(screen.queryByText(/Tenant One/)).not.toBeInTheDocument();
    });

    it('should handle multiple abandoned holdings', () => {
      const { result } = renderHook(() => useDeleteHoldingsModal());
      const abandonedHoldingsResults = [
        { id: 'holding-1' },
        { id: 'holding-2' },
        { id: 'holding-3' },
      ];
      const holdings = [
        { id: 'holding-1', permanentLocationId: 'location-1' },
        { id: 'holding-2', permanentLocationId: 'location-2' },
        { id: 'holding-3', permanentLocationId: 'location-3' },
      ];
      const locations = [
        { id: 'location-1', name: 'Main Library' },
        { id: 'location-2', name: 'Science Library' },
        { id: 'location-3', name: 'Medical Library' },
      ];

      act(() => {
        result.current.initDeleteHoldingsModal(
          abandonedHoldingsResults,
          holdings,
          locations,
        );
      });
      expect(result.current.modal).toBeTruthy();
      render(result.current.modal);
      expect(screen.getByText(/Main Library/)).toBeInTheDocument();
      expect(screen.getByText(/Science Library/)).toBeInTheDocument();
      expect(screen.getByText(/Medical Library/)).toBeInTheDocument();
    });

    it('should handle empty holdings array', () => {
      const { result } = renderHook(() => useDeleteHoldingsModal());
      const abandonedHoldingsResults = [{ id: 'holding-1' }];
      const holdings = [];
      const locations = [];

      act(() => {
        result.current.initDeleteHoldingsModal(
          abandonedHoldingsResults,
          holdings,
          locations,
        );
      });
      expect(result.current.modal).toBeTruthy();
      render(result.current.modal);
      // Should show some fallback or empty state
      expect(screen.getByText(/invalidReference/i)).toBeInTheDocument();
    });
  });
});
