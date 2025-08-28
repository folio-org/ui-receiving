import { BATCH_IDENTIFIER_TYPE } from '../../constants';
import { fetchConsortiumBatchHoldings } from './fetchConsortiumBatchHoldings';

/*
  Fetch holdings by their IDs for a consortium.
*/
export const fetchConsortiumHoldingsByIds = (httpClient, stripes) => (ids, options) => {
  const dto = {
    identifierType: BATCH_IDENTIFIER_TYPE.id,
    identifierValues: ids,
  };

  return fetchConsortiumBatchHoldings(httpClient, stripes)(dto, options);
};
