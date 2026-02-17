export const getHoldingsAbandonmentCheckData = (form) => {
  const values = form.getState().values.receivedItems;
  const initialValues = form.getState().initialValues.receivedItems;

  const holdingIdsSet = new Set();
  const pieceIdsSet = new Set();
  const incomingMap = new Map();

  values.forEach(({ checked, holdingId, id }, index) => {
    const initialHoldingId = initialValues[index]?.holdingId;

    // Check only checked items with holdingId and compare holdingId with initial value to find out if holding was changed
    if (checked && initialHoldingId && (holdingId !== initialHoldingId)) {
      holdingIdsSet.add(initialHoldingId);
      pieceIdsSet.add(id);

      if (holdingId) {
        const incomingPieces = incomingMap.get(holdingId) || [];

        incomingMap.set(holdingId, [...incomingPieces, id]);
      }
    }
  });

  return {
    holdingIds: Array.from(holdingIdsSet),
    pieceIds: Array.from(pieceIdsSet),
    incoming: Object.fromEntries(incomingMap.entries()),
  };
};
