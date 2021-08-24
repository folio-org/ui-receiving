import { useCallback } from 'react';

const UP_KEY_CODE = 38;
const DOWN_KEYCODE = 40;

export const useFieldArrowNavigation = (fieldSetName) => {
  const onKeyDown = useCallback(event => {
    const { keyCode, altKey, target } = event;

    if (!(keyCode === UP_KEY_CODE || keyCode === DOWN_KEYCODE) || !altKey || !target.name) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const cursorOffset = keyCode === UP_KEY_CODE ? -1 : 1;

    const regexp = new RegExp(`${fieldSetName}\\[(\\d+)\\]\\.(.*)`);
    const [, currentCursor, fieldName] = target.name.match(regexp);
    const nextCursor = Number(currentCursor) + cursorOffset;

    const navigationSibling = document.querySelector(`[name="${fieldSetName}[${nextCursor}].${fieldName}"]`);

    if (navigationSibling) {
      navigationSibling.focus();
    }
  }, [fieldSetName]);

  return { onKeyDown };
};
