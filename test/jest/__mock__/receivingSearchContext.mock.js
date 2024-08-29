jest.mock('../../../src/contexts', () => ({
  ...jest.requireActual('../../../src/contexts'),
  useReceivingSearchContext: jest.fn(() => ({
    isCentralRouting: false,
    activeTenantId: 'activeTenantId',
  })),
}));
