import { CONSORTIUM_BATCH_HOLDINGS } from '../../constants';
import { getConsortiumCentralTenantKy } from '../utils';

/*
  Fetch holdings in batch for a consortium. Using DTO with defined identifier type and identifier values.
  https://s3.amazonaws.com/foliodocs/api/mod-search/u/mod-search.html#api-SearchConsortium-fetchConsortiumBatchHoldings
*/
export const fetchConsortiumBatchHoldings = (httpClient, stripes) => (dto, options = {}) => {
  return getConsortiumCentralTenantKy(httpClient, stripes)
    .post(CONSORTIUM_BATCH_HOLDINGS, { json: dto, ...options })
    .json();
};
