export const getCentralOrderingReceivingTenantId = (receivingSearchContext) => {
  const {
    activeTenantId,
    centralTenantId,
    crossTenant,
  } = receivingSearchContext;

  if (crossTenant && activeTenantId !== centralTenantId) {
    return activeTenantId;
  }

  return undefined;
};
