export const setLocationValueFormMutator = (args, state, tools) => {
  const [location, locationField, holdingFieldName, holdingId] = args;
  const locationId = holdingId ? undefined : location?.id || location;

  tools.changeValue(state, locationField, () => locationId);

  if (holdingFieldName) {
    tools.changeValue(state, holdingFieldName, () => holdingId);
  }
};
