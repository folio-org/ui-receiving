import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useItemsList } from './useItemsList';

const pieces = [{ id: 'id' }];
const hookParams = {
  titleId: 'titleId',
  poLineId: 'poLineId',
};

describe('useItemsList', () => {
  it('should return fetched items', async () => {
    const { result } = renderHook(() => useItemsList(hookParams));

    expect(result.current.pieces).toEqual(pieces);
  });
});
