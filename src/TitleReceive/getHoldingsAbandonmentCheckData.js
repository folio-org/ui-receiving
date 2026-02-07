export const getHoldingsAbandonmentCheckData = (form) => {
  const values = form.getState().values.receivedItems;
  const initialValues = form.getState().initialValues.receivedItems;

  const holdingIdsSet = new Set();
  const pieceIdsSet = new Set();

  values.forEach(({ checked, holdingId, id }, index) => {
    const initialHoldingId = initialValues[index]?.holdingId;

    // Check only checked items with holdingId and compare holdingId with initial value to find out if holding was changed
    if (checked && initialHoldingId && (holdingId !== initialHoldingId)) {
      holdingIdsSet.add(initialHoldingId);
      pieceIdsSet.add(id);
    }
  });

  return {
    holdingIds: Array.from(holdingIdsSet),
    pieceIds: Array.from(pieceIdsSet),
  };
};
