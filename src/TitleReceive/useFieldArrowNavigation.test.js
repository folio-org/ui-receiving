import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useFieldArrowNavigation } from './useFieldArrowNavigation';

const fieldSetName = 'pieces';
const getFieldName = idx => `${fieldSetName}[${idx}].displaySummary`;
const createEvent = options => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  ...options,
});

describe('useFieldArrowNavigation', () => {
  it('should return onKeyDown util', async () => {
    const { result } = renderHook(() => useFieldArrowNavigation(fieldSetName));

    expect(result.current.onKeyDown).toBeDefined();
  });

  describe('onKeyDown util', () => {
    let originalQuerySelector;

    beforeAll(() => {
      originalQuerySelector = document.querySelector;
    });

    afterAll(() => {
      document.querySelector = originalQuerySelector;
    });

    beforeEach(() => {
      document.querySelector = jest.fn();
    });

    it('should focus existing next field sibling when alt + up shortcut is pressed', () => {
      const focus = jest.fn();
      const { result } = renderHook(() => useFieldArrowNavigation(fieldSetName));
      const event = createEvent({ keyCode: 38, altKey: true, target: { name: getFieldName(1) } });

      document.querySelector.mockReturnValue({ focus });

      result.current.onKeyDown(event);

      expect(document.querySelector).toHaveBeenCalledWith(`[name="${getFieldName(0)}"]`);
      expect(focus).toHaveBeenCalled();
    });

    it('should focus existing previous field sibling when alt + down shortcut is pressed', () => {
      const focus = jest.fn();
      const { result } = renderHook(() => useFieldArrowNavigation(fieldSetName));
      const event = createEvent({ keyCode: 40, altKey: true, target: { name: getFieldName(0) } });

      document.querySelector.mockReturnValue({ focus });

      result.current.onKeyDown(event);

      expect(document.querySelector).toHaveBeenCalledWith(`[name="${getFieldName(1)}"]`);
      expect(focus).toHaveBeenCalled();
    });

    it('should not use navigation when not field is used for keyDown', () => {
      const { result } = renderHook(() => useFieldArrowNavigation(fieldSetName));
      const event = createEvent({ keyCode: 40, altKey: true, target: { } });

      result.current.onKeyDown(event);

      expect(document.querySelector).not.toHaveBeenCalled();
    });

    it('should not use navigation when keyDown was pressed with alt', () => {
      const { result } = renderHook(() => useFieldArrowNavigation(fieldSetName));
      const event = createEvent({ keyCode: 40, altKey: false, target: { name: getFieldName(0) } });

      result.current.onKeyDown(event);

      expect(document.querySelector).not.toHaveBeenCalled();
    });
  });
});
