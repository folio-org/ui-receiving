import { getHoldingsAbandonmentCheckData } from './getHoldingsAbandonmentCheckData';

describe('getHoldingsAbandonmentCheckData', () => {
  it('should return empty arrays when no items are checked', () => {
    const form = {
      getState: jest.fn().mockReturnValue({
        values: {
          receivedItems: [
            { checked: false, holdingId: 'holding-1', id: 'piece-1' },
            { checked: false, holdingId: 'holding-2', id: 'piece-2' },
          ],
        },
        initialValues: {
          receivedItems: [
            { holdingId: 'holding-1-initial' },
            { holdingId: 'holding-2-initial' },
          ],
        },
      }),
    };

    const result = getHoldingsAbandonmentCheckData(form);

    expect(result).toEqual({
      holdingIds: [],
      pieceIds: [],
      incoming: {},
    });
  });

  it('should return empty arrays when holdingId has not changed', () => {
    const form = {
      getState: jest.fn().mockReturnValue({
        values: {
          receivedItems: [
            { checked: true, holdingId: 'holding-1', id: 'piece-1' },
            { checked: true, holdingId: 'holding-2', id: 'piece-2' },
          ],
        },
        initialValues: {
          receivedItems: [
            { holdingId: 'holding-1' },
            { holdingId: 'holding-2' },
          ],
        },
      }),
    };

    const result = getHoldingsAbandonmentCheckData(form);

    expect(result).toEqual({
      holdingIds: [],
      pieceIds: [],
      incoming: {},
    });
  });

  it('should return data when holdingId has changed', () => {
    const form = {
      getState: jest.fn().mockReturnValue({
        values: {
          receivedItems: [
            { checked: true, holdingId: 'holding-1-new', id: 'piece-1' },
            { checked: true, holdingId: 'holding-2-new', id: 'piece-2' },
          ],
        },
        initialValues: {
          receivedItems: [
            { holdingId: 'holding-1-initial' },
            { holdingId: 'holding-2-initial' },
          ],
        },
      }),
    };

    const result = getHoldingsAbandonmentCheckData(form);

    expect(result).toEqual({
      holdingIds: ['holding-1-initial', 'holding-2-initial'],
      pieceIds: ['piece-1', 'piece-2'],
      incoming: {
        'holding-1-new': ['piece-1'],
        'holding-2-new': ['piece-2'],
      },
    });
  });

  it('should handle items with null new holdingId', () => {
    const form = {
      getState: jest.fn().mockReturnValue({
        values: {
          receivedItems: [
            { checked: true, holdingId: null, id: 'piece-1' },
          ],
        },
        initialValues: {
          receivedItems: [
            { holdingId: 'holding-1-initial' },
          ],
        },
      }),
    };

    const result = getHoldingsAbandonmentCheckData(form);

    expect(result).toEqual({
      holdingIds: ['holding-1-initial'],
      pieceIds: ['piece-1'],
      incoming: {},
    });
  });

  it('should handle items with undefined new holdingId', () => {
    const form = {
      getState: jest.fn().mockReturnValue({
        values: {
          receivedItems: [
            { checked: true, holdingId: undefined, id: 'piece-1' },
          ],
        },
        initialValues: {
          receivedItems: [
            { holdingId: 'holding-1-initial' },
          ],
        },
      }),
    };

    const result = getHoldingsAbandonmentCheckData(form);

    expect(result).toEqual({
      holdingIds: ['holding-1-initial'],
      pieceIds: ['piece-1'],
      incoming: {},
    });
  });

  it('should skip items without initial holdingId', () => {
    const form = {
      getState: jest.fn().mockReturnValue({
        values: {
          receivedItems: [
            { checked: true, holdingId: 'holding-1-new', id: 'piece-1' },
          ],
        },
        initialValues: {
          receivedItems: [
            { holdingId: null },
          ],
        },
      }),
    };

    const result = getHoldingsAbandonmentCheckData(form);

    expect(result).toEqual({
      holdingIds: [],
      pieceIds: [],
      incoming: {},
    });
  });

  it('should handle multiple pieces moving to the same holding', () => {
    const form = {
      getState: jest.fn().mockReturnValue({
        values: {
          receivedItems: [
            { checked: true, holdingId: 'holding-new', id: 'piece-1' },
            { checked: true, holdingId: 'holding-new', id: 'piece-2' },
            { checked: true, holdingId: 'holding-new', id: 'piece-3' },
          ],
        },
        initialValues: {
          receivedItems: [
            { holdingId: 'holding-1-initial' },
            { holdingId: 'holding-2-initial' },
            { holdingId: 'holding-3-initial' },
          ],
        },
      }),
    };

    const result = getHoldingsAbandonmentCheckData(form);

    expect(result).toEqual({
      holdingIds: ['holding-1-initial', 'holding-2-initial', 'holding-3-initial'],
      pieceIds: ['piece-1', 'piece-2', 'piece-3'],
      incoming: {
        'holding-new': ['piece-1', 'piece-2', 'piece-3'],
      },
    });
  });

  it('should handle mixed scenario with checked and unchecked items', () => {
    const form = {
      getState: jest.fn().mockReturnValue({
        values: {
          receivedItems: [
            { checked: true, holdingId: 'holding-1-new', id: 'piece-1' },
            { checked: false, holdingId: 'holding-2-new', id: 'piece-2' },
            { checked: true, holdingId: 'holding-3-new', id: 'piece-3' },
          ],
        },
        initialValues: {
          receivedItems: [
            { holdingId: 'holding-1-initial' },
            { holdingId: 'holding-2-initial' },
            { holdingId: 'holding-3-initial' },
          ],
        },
      }),
    };

    const result = getHoldingsAbandonmentCheckData(form);

    expect(result).toEqual({
      holdingIds: ['holding-1-initial', 'holding-3-initial'],
      pieceIds: ['piece-1', 'piece-3'],
      incoming: {
        'holding-1-new': ['piece-1'],
        'holding-3-new': ['piece-3'],
      },
    });
  });

  it('should handle mixed scenario with changed and unchanged holdings', () => {
    const form = {
      getState: jest.fn().mockReturnValue({
        values: {
          receivedItems: [
            { checked: true, holdingId: 'holding-1-new', id: 'piece-1' },
            { checked: true, holdingId: 'holding-2', id: 'piece-2' },
            { checked: true, holdingId: 'holding-3-new', id: 'piece-3' },
          ],
        },
        initialValues: {
          receivedItems: [
            { holdingId: 'holding-1-initial' },
            { holdingId: 'holding-2' },
            { holdingId: 'holding-3-initial' },
          ],
        },
      }),
    };

    const result = getHoldingsAbandonmentCheckData(form);

    expect(result).toEqual({
      holdingIds: ['holding-1-initial', 'holding-3-initial'],
      pieceIds: ['piece-1', 'piece-3'],
      incoming: {
        'holding-1-new': ['piece-1'],
        'holding-3-new': ['piece-3'],
      },
    });
  });

  it('should not duplicate holdingIds when multiple pieces from same holding', () => {
    const form = {
      getState: jest.fn().mockReturnValue({
        values: {
          receivedItems: [
            { checked: true, holdingId: 'holding-new-1', id: 'piece-1' },
            { checked: true, holdingId: 'holding-new-2', id: 'piece-2' },
          ],
        },
        initialValues: {
          receivedItems: [
            { holdingId: 'holding-initial' },
            { holdingId: 'holding-initial' },
          ],
        },
      }),
    };

    const result = getHoldingsAbandonmentCheckData(form);

    expect(result).toEqual({
      holdingIds: ['holding-initial'],
      pieceIds: ['piece-1', 'piece-2'],
      incoming: {
        'holding-new-1': ['piece-1'],
        'holding-new-2': ['piece-2'],
      },
    });
  });
});
