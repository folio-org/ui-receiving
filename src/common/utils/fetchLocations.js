import {
  batchFetch,
} from '@folio/stripes-acq-components';

export function fetchLocations(mutatorLocations, pieces, poLine) {
  const piecesLocationIds = pieces.map(({ locationId }) => locationId);
  const poLineLocationIds = poLine?.locations?.map(({ locationId }) => locationId);
  const locationIds = [...new Set([...poLineLocationIds, ...piecesLocationIds])];

  return batchFetch(mutatorLocations, locationIds);
}
