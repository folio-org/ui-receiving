import {
  createGetAll,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import { REQUESTS_API } from '../../../../src/common/constants';

const SCHEMA_NAME = 'requests';

export const configRequests = server => {
  server.get(`${REQUESTS_API}`, createGetAll(SCHEMA_NAME));
};
