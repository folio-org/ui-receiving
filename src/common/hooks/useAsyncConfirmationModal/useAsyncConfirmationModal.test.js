import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';

import { useAsyncConfirmationModal } from './useAsyncConfirmationModal';

describe('useAsyncConfirmationModal', () => {
  it('should initialize with modal closed', () => {
    const { result } = renderHook(() => useAsyncConfirmationModal());

    expect(result.current.isModalOpen).toBe(false);
  });

  it('should open modal when init is called', () => {
    const { result } = renderHook(() => useAsyncConfirmationModal());

    act(() => {
      result.current.init();
    });

    expect(result.current.isModalOpen).toBe(true);
  });

  it('should return a promise from init', () => {
    const { result } = renderHook(() => useAsyncConfirmationModal());

    let promise;

    act(() => {
      promise = result.current.init();
    });

    expect(promise).toBeInstanceOf(Promise);
  });

  it('should resolve promise when confirm is called', async () => {
    const { result } = renderHook(() => useAsyncConfirmationModal());
    const testData = { test: 'data' };
    let resolvedValue;

    await act(async () => {
      const promise = result.current.init();

      result.current.confirm(testData);
      resolvedValue = await promise;
    });

    expect(resolvedValue).toEqual(testData);
  });

  it('should reject promise when cancel is called', async () => {
    const { result } = renderHook(() => useAsyncConfirmationModal());
    const testData = { test: 'error' };
    let rejectedValue;

    await act(async () => {
      const promise = result.current.init();

      result.current.cancel(testData);

      try {
        await promise;
      } catch (error) {
        rejectedValue = error;
      }
    });

    expect(rejectedValue).toEqual(testData);
  });

  it('should close modal after promise resolves', async () => {
    const { result } = renderHook(() => useAsyncConfirmationModal());

    await act(async () => {
      const promise = result.current.init();

      result.current.confirm();
      await promise;
    });

    expect(result.current.isModalOpen).toBe(false);
  });

  it('should close modal after promise rejects', async () => {
    const { result } = renderHook(() => useAsyncConfirmationModal());

    await act(async () => {
      const promise = result.current.init();

      result.current.cancel();

      try {
        await promise;
      } catch (error) {
        // Expected rejection
      }
    });

    expect(result.current.isModalOpen).toBe(false);
  });

  it('should handle multiple consecutive init calls', async () => {
    const { result } = renderHook(() => useAsyncConfirmationModal());

    await act(async () => {
      const promise1 = result.current.init();

      result.current.confirm('first');

      await promise1;

      const promise2 = result.current.init();

      result.current.confirm('second');

      const result2 = await promise2;

      expect(result2).toBe('second');
    });
  });
});
