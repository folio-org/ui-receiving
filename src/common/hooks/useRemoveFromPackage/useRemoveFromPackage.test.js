import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react';
import { useModalToggle, useShowCallout } from '@folio/stripes-acq-components';

import { useRemoveFromPackage } from './useRemoveFromPackage';
import { useTitleMutation } from '../useTitleMutation';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useModalToggle: jest.fn(),
  useShowCallout: jest.fn(),
}));

jest.mock('../useTitleMutation', () => ({
  useTitleMutation: jest.fn(),
}));

const toggleRemoveFromPackageModal = jest.fn();
const toggleRemoveHoldingsModal = jest.fn();
const showCallout = jest.fn();
const deleteTitle = jest.fn();

describe('useRemoveFromPackage', () => {
  beforeEach(() => {
    useModalToggle
      .mockClear()
      .mockReturnValueOnce([false, toggleRemoveFromPackageModal])
      .mockReturnValueOnce([false, toggleRemoveHoldingsModal]);
    useShowCallout.mockClear().mockReturnValue(showCallout);
    useTitleMutation.mockClear().mockReturnValue({ deleteTitle });
  });

  it('calls deleteTitle and onSuccess on successful deletion', async () => {
    const onSuccess = jest.fn();

    deleteTitle.mockResolvedValueOnce();

    const { result } = renderHook(() => useRemoveFromPackage({ id: 'title-id', onSuccess }));

    await act(async () => {
      await result.current.onConfirmRemoveFromPackage();
    });

    expect(deleteTitle).toHaveBeenCalledWith({ id: 'title-id', searchParams: {} });
    expect(onSuccess).toHaveBeenCalled();
    expect(showCallout).toHaveBeenCalledWith({
      messageId: 'ui-receiving.title.confirmationModal.removeFromPackage.success',
    });
  });

  it('opens holdings modal on known error code', async () => {
    const onSuccess = jest.fn();
    const errorResponse = {
      response: {
        json: async () => ({
          errors: [{
            code: 'existingHoldingsForDeleteConfirmation',
            message: 'some.message.code',
          }],
        }),
      },
    };

    deleteTitle.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useRemoveFromPackage({ id: 'title-id', onSuccess }));

    await act(async () => {
      await result.current.onConfirmRemoveFromPackage();
    });

    expect(toggleRemoveFromPackageModal).toHaveBeenCalled();
    expect(toggleRemoveHoldingsModal).toHaveBeenCalled();
  });

  it('shows error callout on unknown error code', async () => {
    const onSuccess = jest.fn();
    const errorResponse = {
      response: {
        json: async () => ({
          errors: [{
            code: 'someOtherError',
            message: 'ui-error.unknown',
          }],
        }),
      },
    };

    deleteTitle.mockRejectedValueOnce(errorResponse);

    const { result } = renderHook(() => useRemoveFromPackage({ id: 'title-id', onSuccess }));

    await act(async () => {
      await result.current.onConfirmRemoveFromPackage();
    });

    expect(showCallout).toHaveBeenCalledWith({
      messageId: 'ui-error.unknown',
      type: 'error',
    });
  });
});
