import { getCentralOrderingReceivingTenantId } from './getCentralOrderingReceivingTenantId';

describe('getCentralOrderingReceivingTenantId', () => {
  const centralTenantId = 'centralTenantId';
  const memberTenantId = 'memberTenantId';

  const testCases = [
    {
      name: 'Central tenant active, central ordering enabled',
      context: { activeTenantId: centralTenantId, centralTenantId, crossTenant: true },
      expected: undefined,
    },
    {
      name: 'Member tenant active, receiving app in central tenant context',
      context: { activeTenantId: memberTenantId, centralTenantId, crossTenant: true },
      expected: memberTenantId,
    },
    {
      name: 'Member tenant active, receiving app in member tenant context',
      context: { activeTenantId: memberTenantId, centralTenantId, crossTenant: false },
      expected: undefined,
    },
    {
      name: 'Central tenant active, central ordering disabled',
      context: { activeTenantId: centralTenantId, centralTenantId, crossTenant: false },
      expected: undefined,
    },
    {
      name: 'Member tenant active, central ordering disabled',
      context: { activeTenantId: memberTenantId, centralTenantId, crossTenant: false },
      expected: undefined,
    },
  ];

  testCases.forEach(({ name, context, expected }) => {
    it(`should return ${expected === undefined ? 'undefined' : expected} when ${name}`, () => {
      expect(getCentralOrderingReceivingTenantId(context)).toBe(expected);
    });
  });
});
