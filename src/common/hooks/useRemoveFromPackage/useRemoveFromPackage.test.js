import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useModalToggle,
  useShowCallout,
  ResponseErrorsContainer,
} from '@folio/stripes-acq-components';

import { ERROR_CODES } from '../../constants';
import { useTitleMutation } from '../useTitleMutation';
import { useRemoveFromPackage } from './useRemoveFromPackage';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useModalToggle: jest.fn(),
  useShowCallout: jest.fn(),
  ResponseErrorsContainer: {
    create: jest.fn(),
  },
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
    jest.clearAllMocks();

    useModalToggle
      .mockReturnValueOnce([false, toggleRemoveFromPackageModal])
      .mockReturnValueOnce([false, toggleRemoveHoldingsModal]);

    useShowCallout.mockReturnValue(showCallout);
    useTitleMutation.mockReturnValue({ deleteTitle });
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

  it('opens holdings modal on existingHoldingsForDeleteConfirmation error code', async () => {
    const onSuccess = jest.fn();

    ResponseErrorsContainer.create.mockResolvedValue({
      handler: {
        getError: () => ({
          code: ERROR_CODES.existingHoldingsForDeleteConfirmation,
          message: 'some.message.code',
        }),
      },
    });

    deleteTitle.mockRejectedValueOnce({ response: {} });

    const { result } = renderHook(() => useRemoveFromPackage({ id: 'title-id', onSuccess }));

    await act(async () => {
      await result.current.onConfirmRemoveFromPackage();
    });

    expect(toggleRemoveFromPackageModal).toHaveBeenCalled();
    expect(toggleRemoveHoldingsModal).toHaveBeenCalled();
  });

  it('shows error callout on unknown error code', async () => {
    const onSuccess = jest.fn();

    ResponseErrorsContainer.create.mockResolvedValue({
      handler: {
        getError: () => ({
          code: 'someOtherError',
          message: 'ui-error.unknown',
        }),
      },
    });

    deleteTitle.mockRejectedValueOnce({ response: {} });

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
